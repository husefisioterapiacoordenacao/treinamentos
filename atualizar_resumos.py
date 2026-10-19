#!/usr/bin/env python3
"""Recria a leitura HTML dos 6 resumos a partir dos arquivos DOCX.

Uso na pasta do portal:
    python -m pip install python-docx
    python atualizar_resumos.py

Não edita os documentos Word originais, os mapas ou os áudios.
"""
from collections import Counter
from html import escape
from pathlib import Path
import json
import re
import unicodedata

try:
    from docx import Document
except ImportError as exc:
    raise SystemExit('Instale a dependência com: python -m pip install python-docx') from exc

ROOT = Path(__file__).resolve().parent
DATA = ROOT / 'conteudos.js'
PREFIX = '/* Conteúdo extraído dos documentos originais fornecidos. */\nwindow.PORTAL_MODULES = '


def slugify(value):
    value = unicodedata.normalize('NFD', value.lower())
    value = ''.join(c for c in value if unicodedata.category(c) != 'Mn')
    return re.sub(r'^-|-$', '', re.sub('[^a-z0-9]+', '-', value))[:65]


def para_html(paragraph):
    rendered = []
    for run in paragraph.runs:
        if not run.text:
            continue
        part = escape(run.text).replace('\n', '<br>')
        if run.bold:
            part = f'<strong>{part}</strong>'
        if run.italic:
            part = f'<em>{part}</em>'
        if run.underline:
            part = f'<u>{part}</u>'
        rendered.append(part)
    return ''.join(rendered) or escape(paragraph.text)


def convert_doc(doc):
    content, toc, count = [], [], Counter()
    words = 0
    in_list = False
    for p in doc.paragraphs:
        text = p.text.strip()
        if not text or p.style.name == 'Title':
            continue
        words += len(text.split())
        style = p.style.name
        if in_list and not style.startswith('List'):
            content.append('</ul>')
            in_list = False
        text_html = para_html(p)
        if style.startswith('Heading'):
            level = 2 if style == 'Heading 1' else 3 if style == 'Heading 2' else 4
            anchor = slugify(text)
            count[anchor] += 1
            if count[anchor] > 1:
                anchor += f'-{count[anchor]}'
            anchor = 'sec-' + anchor
            content.append(f'<h{level} id="{anchor}">{text_html}</h{level}>')
            if level == 2:
                toc.append({'text': text, 'anchor': anchor})
        elif style.startswith('List'):
            if not in_list:
                content.append('<ul>')
                in_list = True
            content.append(f'<li>{text_html}</li>')
        else:
            content.append(f'<p>{text_html}</p>')
    if in_list:
        content.append('</ul>')
    return '\n'.join(content), toc, words


def main():
    text = DATA.read_text(encoding='utf-8')
    if not text.startswith(PREFIX):
        raise SystemExit('Formato do arquivo conteudos.js inesperado; nenhuma alteração realizada.')
    modules = json.loads(text[len(PREFIX):].strip().removesuffix(';'))
    for mod in modules:
        doc_path = ROOT / mod['files']['resumo']
        if not doc_path.is_file():
            raise SystemExit(f'Documento não encontrado: {doc_path}')
        html, toc, words = convert_doc(Document(doc_path))
        mod['article'], mod['toc'], mod['words'], mod['chapters'] = html, toc, words, len(toc)
        print(f"Atualizado: {mod['title']} ({words} palavras)")
    DATA.write_text(PREFIX + json.dumps(modules, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
    print('Concluído: resumos atualizados em conteudos.js')

if __name__ == '__main__':
    main()
