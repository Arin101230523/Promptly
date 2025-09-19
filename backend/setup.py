from setuptools import setup, find_packages

setup(
    name="promptly",
    version="0.1.0",
    description="Promptly: Agentic web scraper and data extractor made easy",
    author="Arin Sood",
    author_email="your@email.com",
    url="https://github.com/Arin101230523/Promptly",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.111.0",
        "requests==2.32.3",
        "uvicorn==0.30.1",
        "groq==0.30.0",
        "pydantic-settings==2.3.0",
        "beautifulsoup4",
        "selenium",
        "python-dotenv",
        "pymongo[srv]",
        "arcadepy",
        "sentence-transformers",
        "scikit-learn",
        "pytest",
    ],
    long_description=open("README.md", encoding="utf-8").read() if __import__('os').path.exists("README.md") else "",
    long_description_content_type="text/markdown",
    license="MIT",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
    include_package_data=True,
    keywords=["web scraping", "agents", "data extraction", "fastapi", "promptly"],
    entry_points={
        "console_scripts": [
            "promptly-server=promptly.main:main",
        ],
    },
)