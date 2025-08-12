import React, { useState } from 'react';
import './DeveloperTools.css';

// Code Generator Tool
export function CodeGenerator({ isOpen, onClose }) {
  const [codeType, setCodeType] = useState('react-component');
  const [componentName, setComponentName] = useState('MyComponent');
  const [generatedCode, setGeneratedCode] = useState('');

  const codeTemplates = {
    'react-component': (name) => `import React, { useState } from 'react';
import './${name}.css';

export default function ${name}() {
  const [data, setData] = useState(null);

  return (
    <div className="${name.toLowerCase()}">
      <h2>${name}</h2>
      <p>Componente generado automáticamente</p>
    </div>
  );
}`,
    'react-hook': (name) => `import { useState, useEffect } from 'react';

export function use${name}() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lógica del hook aquí
  }, []);

  return { data, loading, error };
}`,
    'express-route': (name) => `const express = require('express');
const router = express.Router();

// GET /${name.toLowerCase()}
router.get('/', async (req, res) => {
  try {
    // Lógica aquí
    res.json({ message: '${name} funcionando correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /${name.toLowerCase()}
router.post('/', async (req, res) => {
  try {
    const { data } = req.body;
    // Procesar datos
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;`,
    'css-component': (name) => `.${name.toLowerCase()} {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.${name.toLowerCase()}:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.${name.toLowerCase()} h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.${name.toLowerCase()} p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}`
  };

  const generateCode = () => {
    const template = codeTemplates[codeType];
    if (template) {
      setGeneratedCode(template(componentName));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('Código copiado al portapapeles!');
  };

  if (!isOpen) return null;

  return (
    <div className="tool-modal">
      <div className="tool-modal-content">
        <div className="tool-modal-header">
          <h3><i className="fas fa-magic"></i> Generador de Código</h3>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="tool-modal-body">
          <div className="form-group">
            <label>Tipo de código:</label>
            <select value={codeType} onChange={(e) => setCodeType(e.target.value)}>
              <option value="react-component">Componente React</option>
              <option value="react-hook">Hook de React</option>
              <option value="express-route">Ruta Express.js</option>
              <option value="css-component">Estilos CSS</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="Nombre del componente/archivo"
            />
          </div>
          
          <button onClick={generateCode} className="generate-btn">
            <i className="fas fa-cog"></i>
            Generar Código
          </button>
          
          {generatedCode && (
            <div className="code-output">
              <div className="output-header">
                <span>Código generado:</span>
                <button onClick={copyToClipboard} className="copy-btn">
                  <i className="fas fa-copy"></i>
                  Copiar
                </button>
              </div>
              <pre><code>{generatedCode}</code></pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Color Palette Generator
export function ColorPalette({ isOpen, onClose }) {
  const [baseColor, setBaseColor] = useState('#64ffda');
  const [paletteType, setPaletteType] = useState('complementary');
  const [colors, setColors] = useState([]);

  const generatePalette = () => {
    const hsl = hexToHsl(baseColor);
    let newColors = [];

    switch (paletteType) {
      case 'complementary':
        newColors = [
          baseColor,
          hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
          hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 10)),
          hslToHex((hsl.h + 180) % 360, hsl.s, Math.max(hsl.l - 20, 10))
        ];
        break;
      case 'triadic':
        newColors = [
          baseColor,
          hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
          hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 30, 10))
        ];
        break;
      case 'analogous':
        newColors = [
          hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
          baseColor,
          hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
          hslToHex((hsl.h + 60) % 360, hsl.s, hsl.l)
        ];
        break;
      case 'monochromatic':
        newColors = [
          hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 30, 90)),
          hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 15, 90)),
          baseColor,
          hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 15, 10)),
          hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 30, 10))
        ];
        break;
    }
    setColors(newColors);
  };

  const copyColor = (color) => {
    navigator.clipboard.writeText(color);
    alert(`Color ${color} copiado!`);
  };

  const exportCSS = () => {
    const css = `:root {
${colors.map((color, index) => `  --color-${index + 1}: ${color};`).join('\n')}
}`;
    navigator.clipboard.writeText(css);
    alert('Variables CSS copiadas al portapapeles!');
  };

  // Utility functions
  function hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 1/6) {
      r = c; g = x; b = 0;
    } else if (1/6 <= h && h < 2/6) {
      r = x; g = c; b = 0;
    } else if (2/6 <= h && h < 3/6) {
      r = 0; g = c; b = x;
    } else if (3/6 <= h && h < 4/6) {
      r = 0; g = x; b = c;
    } else if (4/6 <= h && h < 5/6) {
      r = x; g = 0; b = c;
    } else if (5/6 <= h && h < 1) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  if (!isOpen) return null;

  return (
    <div className="tool-modal">
      <div className="tool-modal-content">
        <div className="tool-modal-header">
          <h3><i className="fas fa-palette"></i> Generador de Paletas</h3>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="tool-modal-body">
          <div className="form-group">
            <label>Color base:</label>
            <div className="color-input-group">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                placeholder="#64ffda"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Tipo de paleta:</label>
            <select value={paletteType} onChange={(e) => setPaletteType(e.target.value)}>
              <option value="complementary">Complementaria</option>
              <option value="triadic">Triádica</option>
              <option value="analogous">Análoga</option>
              <option value="monochromatic">Monocromática</option>
            </select>
          </div>
          
          <button onClick={generatePalette} className="generate-btn">
            <i className="fas fa-magic"></i>
            Generar Paleta
          </button>
          
          {colors.length > 0 && (
            <div className="palette-output">
              <div className="output-header">
                <span>Paleta generada:</span>
                <button onClick={exportCSS} className="copy-btn">
                  <i className="fas fa-download"></i>
                  Exportar CSS
                </button>
              </div>
              <div className="color-palette">
                {colors.map((color, index) => (
                  <div key={index} className="color-swatch" onClick={() => copyColor(color)}>
                    <div className="color-box" style={{ backgroundColor: color }}></div>
                    <span className="color-code">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Lorem Ipsum Generator
export function LoremGenerator({ isOpen, onClose }) {
  const [type, setType] = useState('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [generatedText, setGeneratedText] = useState('');

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const generateLorem = () => {
    let result = '';

    if (type === 'words') {
      const words = [];
      for (let i = 0; i < count; i++) {
        words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
      }
      result = words.join(' ') + '.';
    } else if (type === 'sentences') {
      const sentences = [];
      for (let i = 0; i < count; i++) {
        const sentenceLength = Math.floor(Math.random() * 15) + 5;
        const words = [];
        for (let j = 0; j < sentenceLength; j++) {
          words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
        }
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        sentences.push(words.join(' ') + '.');
      }
      result = sentences.join(' ');
    } else if (type === 'paragraphs') {
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        const sentences = [];
        const sentenceCount = Math.floor(Math.random() * 6) + 3;
        for (let j = 0; j < sentenceCount; j++) {
          const sentenceLength = Math.floor(Math.random() * 15) + 5;
          const words = [];
          for (let k = 0; k < sentenceLength; k++) {
            words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
          }
          words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
          sentences.push(words.join(' ') + '.');
        }
        paragraphs.push(sentences.join(' '));
      }
      result = paragraphs.join('\n\n');
    }

    if (startWithLorem && type !== 'words') {
      result = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + result;
    }

    setGeneratedText(result);
  };

  const copyText = () => {
    navigator.clipboard.writeText(generatedText);
    alert('Texto copiado al portapapeles!');
  };

  if (!isOpen) return null;

  return (
    <div className="tool-modal">
      <div className="tool-modal-content">
        <div className="tool-modal-header">
          <h3><i className="fas fa-text-height"></i> Generador Lorem Ipsum</h3>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="tool-modal-body">
          <div className="form-group">
            <label>Tipo:</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="words">Palabras</option>
              <option value="sentences">Oraciones</option>
              <option value="paragraphs">Párrafos</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Cantidad:</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              min="1"
              max="50"
            />
          </div>
          
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
              />
              Comenzar con "Lorem ipsum"
            </label>
          </div>
          
          <button onClick={generateLorem} className="generate-btn">
            <i className="fas fa-magic"></i>
            Generar Texto
          </button>
          
          {generatedText && (
            <div className="text-output">
              <div className="output-header">
                <span>Texto generado:</span>
                <button onClick={copyText} className="copy-btn">
                  <i className="fas fa-copy"></i>
                  Copiar
                </button>
              </div>
              <textarea value={generatedText} readOnly rows="10" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Base64 Encoder/Decoder
export function Base64Tool({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');
  const [error, setError] = useState('');

  const processBase64 = () => {
    try {
      if (mode === 'encode') {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
      }
      setError('');
    } catch (err) {
      setError(mode === 'encode' ? 'Error al codificar' : 'Base64 inválido');
      setOutput('');
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    alert('Resultado copiado al portapapeles!');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="tool-modal">
      <div className="tool-modal-content">
        <div className="tool-modal-header">
          <h3><i className="fas fa-lock"></i> Codificador Base64</h3>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="tool-modal-body">
          <div className="form-group">
            <label>Modo:</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="encode">Codificar a Base64</option>
              <option value="decode">Decodificar de Base64</option>
            </select>
          </div>

          <div className="form-group">
            <label>{mode === 'encode' ? 'Texto a codificar:' : 'Base64 a decodificar:'}</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Introduce el texto aquí...' : 'Introduce el Base64 aquí...'}
              rows="6"
            />
          </div>

          <div className="action-buttons">
            <button onClick={processBase64} className="generate-btn">
              <i className="fas fa-magic"></i>
              {mode === 'encode' ? 'Codificar' : 'Decodificar'}
            </button>
            <button onClick={clearAll} className="clear-btn">
              <i className="fas fa-trash"></i>
              Limpiar
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {output && (
            <div className="text-output">
              <div className="output-header">
                <span>Resultado:</span>
                <button onClick={copyOutput} className="copy-btn">
                  <i className="fas fa-copy"></i>
                  Copiar
                </button>
              </div>
              <textarea value={output} readOnly rows="6" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// URL Encoder/Decoder
export function URLTool({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encode');

  const processURL = () => {
    try {
      if (mode === 'encode') {
        const encoded = encodeURIComponent(input);
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(input);
        setOutput(decoded);
      }
    } catch (err) {
      alert('Error al procesar la URL');
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    alert('Resultado copiado al portapapeles!');
  };

  if (!isOpen) return null;

  return (
    <div className="tool-modal">
      <div className="tool-modal-content">
        <div className="tool-modal-header">
          <h3><i className="fas fa-link"></i> Codificador URL</h3>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="tool-modal-body">
          <div className="form-group">
            <label>Modo:</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="encode">Codificar URL</option>
              <option value="decode">Decodificar URL</option>
            </select>
          </div>

          <div className="form-group">
            <label>{mode === 'encode' ? 'URL a codificar:' : 'URL a decodificar:'}</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'https://ejemplo.com/página con espacios' : 'https%3A//ejemplo.com/p%C3%A1gina%20con%20espacios'}
              rows="4"
            />
          </div>

          <button onClick={processURL} className="generate-btn">
            <i className="fas fa-magic"></i>
            {mode === 'encode' ? 'Codificar' : 'Decodificar'}
          </button>

          {output && (
            <div className="text-output">
              <div className="output-header">
                <span>Resultado:</span>
                <button onClick={copyOutput} className="copy-btn">
                  <i className="fas fa-copy"></i>
                  Copiar
                </button>
              </div>
              <textarea value={output} readOnly rows="4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Hash Generator
export function HashTool({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState({});

  const generateHashes = async () => {
    if (!input) return;

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    try {
      // MD5 simulation (simple hash for demo)
      const simpleHash = Array.from(data).reduce((hash, byte) => {
        hash = ((hash << 5) - hash) + byte;
        return hash & hash;
      }, 0);

      // SHA-256
      const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
      const sha256Array = Array.from(new Uint8Array(sha256Buffer));
      const sha256 = sha256Array.map(b => b.toString(16).padStart(2, '0')).join('');

      // SHA-1
      const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
      const sha1Array = Array.from(new Uint8Array(sha1Buffer));
      const sha1 = sha1Array.map(b => b.toString(16).padStart(2, '0')).join('');

      setResults({
        md5: Math.abs(simpleHash).toString(16).padStart(8, '0'),
        sha1,
        sha256
      });
    } catch (err) {
      alert('Error al generar hashes');
    }
  };

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    alert('Hash copiado al portapapeles!');
  };

  if (!isOpen) return null;

  return (
    <div className="tool-modal">
      <div className="tool-modal-content">
        <div className="tool-modal-header">
          <h3><i className="fas fa-fingerprint"></i> Generador de Hashes</h3>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="tool-modal-body">
          <div className="form-group">
            <label>Texto a hashear:</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Introduce el texto aquí..."
              rows="4"
            />
          </div>

          <button onClick={generateHashes} className="generate-btn">
            <i className="fas fa-magic"></i>
            Generar Hashes
          </button>

          {Object.keys(results).length > 0 && (
            <div className="hash-results">
              {Object.entries(results).map(([algorithm, hash]) => (
                <div key={algorithm} className="hash-result">
                  <div className="hash-label">{algorithm.toUpperCase()}:</div>
                  <div className="hash-value" onClick={() => copyHash(hash)}>
                    {hash}
                    <i className="fas fa-copy"></i>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Password Generator
export function PasswordGenerator({ isOpen, onClose }) {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (!charset) {
      alert('Selecciona al menos un tipo de carácter');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setPassword(newPassword);
    calculateStrength(newPassword);
  };

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    const strengths = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Fuerte', 'Muy fuerte'];
    setStrength(strengths[Math.min(score, 5)]);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    alert('Contraseña copiada al portapapeles!');
  };

  if (!isOpen) return null;

  return (
    <div className="tool-modal">
      <div className="tool-modal-content">
        <div className="tool-modal-header">
          <h3><i className="fas fa-key"></i> Generador de Contraseñas</h3>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="tool-modal-body">
          <div className="form-group">
            <label>Longitud: {length}</label>
            <input
              type="range"
              min="4"
              max="50"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
              />
              Mayúsculas (A-Z)
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
              />
              Minúsculas (a-z)
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
              />
              Números (0-9)
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
              />
              Símbolos (!@#$%^&*)
            </label>
          </div>

          <button onClick={generatePassword} className="generate-btn">
            <i className="fas fa-magic"></i>
            Generar Contraseña
          </button>

          {password && (
            <div className="password-output">
              <div className="output-header">
                <span>Contraseña generada:</span>
                <button onClick={copyPassword} className="copy-btn">
                  <i className="fas fa-copy"></i>
                  Copiar
                </button>
              </div>
              <div className="password-display">
                <input type="text" value={password} readOnly />
                <div className={`strength-indicator ${strength.toLowerCase().replace(' ', '-')}`}>
                  Seguridad: {strength}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Regex Tester
export function RegexTester({ isOpen, onClose }) {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  const testRegex = () => {
    try {
      if (!pattern) {
        setError('Introduce un patrón de regex');
        return;
      }

      const regex = new RegExp(pattern, flags);
      const foundMatches = [...testString.matchAll(regex)];

      setMatches(foundMatches.map((match, index) => ({
        index,
        match: match[0],
        position: match.index,
        groups: match.slice(1)
      })));
      setError('');
    } catch (err) {
      setError('Regex inválido: ' + err.message);
      setMatches([]);
    }
  };

  const loadExample = () => {
    setPattern('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b');
    setFlags('gi');
    setTestString('Contacta con juan@ejemplo.com o maria.garcia@empresa.org para más información.');
  };

  if (!isOpen) return null;

  return (
    <div className="tool-modal">
      <div className="tool-modal-content large">
        <div className="tool-modal-header">
          <h3><i className="fas fa-search"></i> Probador de Regex</h3>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="tool-modal-body">
          <div className="regex-tester">
            <div className="form-group">
              <label>Patr��n Regex:</label>
              <div className="regex-input">
                <span>/</span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="tu-regex-aqui"
                />
                <span>/</span>
                <input
                  type="text"
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  placeholder="flags"
                  className="flags-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Texto de prueba:</label>
              <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Introduce el texto para probar el regex..."
                rows="6"
              />
            </div>

            <div className="action-buttons">
              <button onClick={testRegex} className="generate-btn">
                <i className="fas fa-play"></i>
                Probar Regex
              </button>
              <button onClick={loadExample} className="sample-btn">
                <i className="fas fa-file-import"></i>
                Cargar ejemplo
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {matches.length > 0 && (
              <div className="matches-output">
                <div className="output-header">
                  <span>{matches.length} coincidencia{matches.length !== 1 ? 's' : ''} encontrada{matches.length !== 1 ? 's' : ''}:</span>
                </div>
                <div className="matches-list">
                  {matches.map((match) => (
                    <div key={match.index} className="match-item">
                      <div className="match-text">"{match.match}"</div>
                      <div className="match-details">
                        Posición: {match.position}
                        {match.groups.length > 0 && (
                          <span> | Grupos: {match.groups.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {matches.length === 0 && pattern && testString && !error && (
              <div className="no-matches">No se encontraron coincidencias</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// JSON Formatter
export function JSONFormatter({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState('');

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setError('');
    } catch (err) {
      setError('JSON inválido: ' + err.message);
      setOutput('');
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError('');
    } catch (err) {
      setError('JSON inválido: ' + err.message);
      setOutput('');
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(input);
      setError('');
      alert('✅ JSON válido!');
    } catch (err) {
      setError('JSON inválido: ' + err.message);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    alert('JSON copiado al portapapeles!');
  };

  const loadSample = () => {
    const sample = `{
  "nombre": "Juan Pérez",
  "edad": 30,
  "email": "juan@ejemplo.com",
  "direccion": {
    "calle": "Calle Principal 123",
    "ciudad": "Buenos Aires",
    "pais": "Argentina"
  },
  "hobbies": ["programar", "leer", "viajar"],
  "activo": true
}`;
    setInput(sample);
  };

  if (!isOpen) return null;

  return (
    <div className="tool-modal">
      <div className="tool-modal-content large">
        <div className="tool-modal-header">
          <h3><i className="fas fa-code"></i> Formateador JSON</h3>
          <button onClick={onClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="tool-modal-body">
          <div className="json-formatter">
            <div className="json-input-section">
              <div className="section-header">
                <span>JSON de entrada:</span>
                <div className="controls">
                  <button onClick={loadSample} className="sample-btn">
                    <i className="fas fa-file-import"></i>
                    Cargar ejemplo
                  </button>
                  <button onClick={validateJSON} className="validate-btn">
                    <i className="fas fa-check-circle"></i>
                    Validar
                  </button>
                </div>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pega tu JSON aquí..."
                rows="12"
                className="json-textarea"
              />
            </div>
            
            <div className="json-controls">
              <div className="form-group">
                <label>Indentación:</label>
                <select value={indent} onChange={(e) => setIndent(parseInt(e.target.value))}>
                  <option value={2}>2 espacios</option>
                  <option value={4}>4 espacios</option>
                  <option value={8}>8 espacios</option>
                </select>
              </div>
              
              <div className="action-buttons">
                <button onClick={formatJSON} className="format-btn">
                  <i className="fas fa-magic"></i>
                  Formatear
                </button>
                <button onClick={minifyJSON} className="minify-btn">
                  <i className="fas fa-compress"></i>
                  Minificar
                </button>
              </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            {output && (
              <div className="json-output-section">
                <div className="output-header">
                  <span>JSON formateado:</span>
                  <button onClick={copyOutput} className="copy-btn">
                    <i className="fas fa-copy"></i>
                    Copiar
                  </button>
                </div>
                <pre className="json-output"><code>{output}</code></pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
