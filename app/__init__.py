"""
文件名: __init__.py
作者: MarkCup
版本: 0.1
创建日期: 2023-12-23
最后修改日期: 2023-12-23
描述: 创建flask对象
"""

from flask import Flask
from app.routes import main_bp

def create_app():
    # 创建实例
    app = Flask(__name__)
    
    # 绑定蓝图
    app.register_blueprint(main_bp)

    return app
