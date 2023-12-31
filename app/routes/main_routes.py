"""
文件名: main_routes.py
作者: MarkCup
版本: 0.1
创建日期: 2023-12-25
最后修改日期: 2023-12-25
描述: 主要路由绑定
"""

from flask import render_template
from . import main_bp

# 主页路由
@main_bp.route('/')
def index():
    return render_template('main/index.html')

# 文章页面路由
@main_bp.route('/articles')
def articles():
    return render_template('main/articles.html')

# 下载页面路由
@main_bp.route('/download')
def download():
    return render_template('main/download.html')