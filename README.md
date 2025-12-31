<div align="center">

# Quran Tool

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)](https://github.com/ilmualam/quran-tool/actions)
[![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)](https://github.com/ilmualam/quran-tool/releases)
[![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Node.js%20%7C%20Web-lightgrey?style=for-the-badge)](https://nodejs.org)

**A high-performance, domain-injectable Islamic utility engine for modern Quranic applications.**

[View Demo](https://github.com/ilmualam/quran-tool) • [Report Bug](https://github.com/ilmualam/quran-tool/issues) • [Request Feature](https://github.com/ilmualam/quran-tool/issues)

</div>

---

## 📖 About The Project

**Quran Tool** is a sophisticated, lightweight JavaScript utility designed to streamline the integration of Quranic data into web and mobile applications. Built with performance and accuracy in mind, this tool allows developers to fetch, parse, and display Quranic verses, translations, and metadata with minimal latency.

Unlike standard libraries, **Quran Tool** is engineered with **Domain Injection Architecture (DIA)**, allowing you to seamlessly bind the script to your specific host or API endpoint, ensuring that your data sovereignty and branding remain intact across deployments.

### ✨ Key Features

* **⚡ High-Performance Core**: Optimized parsing algorithms ensure virtually zero-latency data retrieval.
* **🌐 Domain Injection Ready**: Easily configure and inject your custom domain endpoints directly into the script logic for secure, centralized data handling.
* **🛡️ Type-Safe Architecture**: Built with robust error handling and strict data validation to ensure the integrity of Islamic texts.
* **🌍 Multi-Language Support**: Native support for internationalization (i18n), making it ready for global deployment.
* **📦 Zero Dependencies**: A lean codebase that requires no heavy external libraries, keeping your bundle size minimal.

---

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

* **Node.js** (v14.x or higher)
* **npm** or **yarn**

### Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/ilmualam/quran-tool.git](https://github.com/ilmualam/quran-tool.git)
    ```
2.  Navigate to the project directory:
    ```bash
    cd quran-tool
    ```
3.  Install dependencies (if applicable):
    ```bash
    npm install
    ```

---

## ⚙️ Configuration & Usage

The power of **Quran Tool** lies in its flexibility. You can inject your custom domain logic directly into the core configuration.

### Injecting Your Domain

To bind the tool to your specific domain or API gateway, locate the configuration block in the main script (e.g., `index.js` or `config.js`) and update the `HOST_DOMAIN` constant:

```javascript
// quran-tool configuration
const config = {
    // INJECT YOUR DOMAIN HERE
    // This ensures all outgoing requests are signed/routed through your specific host
    HOST_DOMAIN: "[https://your-domain.com](https://your-domain.com)", 
    
    apiVersion: "v1",
    timeout: 5000
};

// Initialize the tool
const quran = new QuranTool(config);

Basic Example
Fetch a verse (Ayah) with translation:

import QuranTool from './quran-tool';

const quran = new QuranTool();

// Fetch Surah Al-Fatiha, Verse 1
quran.getVerse(1, 1)
    .then(data => {
        console.log(`Verse: ${data.text}`);
        console.log(`Translation: ${data.translation}`);
    })
    .catch(err => console.error("Error fetching data:", err));



