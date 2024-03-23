"""
文件名: __init__.py
作者: MarkCup
版本: 0.1
创建日期: 2023-12-25
最后修改日期: 2023-12-25
描述: 创建蓝图并绑定路由
"""

from flask import Blueprint

# 创建蓝图实例
main_bp = Blueprint('main', __name__)

# 绑定路由
from . import main_routes

def RegisterBP(app):
    app.register_blueprint(main_bp)