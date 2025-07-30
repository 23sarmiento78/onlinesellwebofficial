# scripts/gemini_analysis.py
import google.generativeai as genai
import json
import os
import sys # Importa sys para manejar argumentos

# La API Key de Gemini se pasará como variable de entorno
genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))

# La ruta al reporte PSI también se pasará como argumento
psi_report_path = sys.argv[1] if len(sys.argv) > 1 else 'pagespeed_report.json'
gemini_output_path = sys.argv[2] if len(sys.argv) > 2 else 'gemini_analysis.md'
github_output_path = os.environ.get('GITHUB_OUTPUT') # Ruta al archivo de salida de GHA

# Cargar el reporte de PageSpeed Insights
try:
    with open(psi_report_path, 'r', encoding='utf-8') as f: # Añadido encoding
        psi_report = json.load(f)
except FileNotFoundError:
    print(f'Error: El archivo {psi_report_path} no fue encontrado.')
    sys.exit(1)
except json.JSONDecodeError:
    print(f'Error: El archivo {psi_report_path} no es un JSON válido.')
    sys.exit(1)


# Extraer los datos relevantes del reporte PSI para hacer el prompt más conciso
metrics = psi_report.get('lighthouseResult', {}).get('audits', {})
performance_score = psi_report.get('lighthouseResult', {}).get('categories', {}).get('performance', {}).get('score')
# URL del sitio que analizamos
site_url = psi_report.get('id', 'hgaruna.org') # 'id' suele contener la URL analizada por PSI

opportunities = []
for audit_id, audit_data in metrics.items():
    if audit_data.get('scoreDisplayMode') == 'metric' or audit_data.get('scoreDisplayMode') == 'opportunity':
        if audit_data.get('details') and audit_data['details'].get('items'):
            # Reducimos los detalles para no sobrecargar el prompt
            simplified_details = [{k: v for k, v in item.items() if k in ['url', 'text', 'wastedMs']} for item in audit_data['details']['items'][:5]] # Limita a 5 items
            opportunities.append({
                'id': audit_id,
                'title': audit_data.get('title'),
                'description': audit_data.get('description'),
                'displayValue': audit_data.get('displayValue'),
                'details_summary': simplified_details
            })

# Crear el prompt para Gemini
# Se usará la URL obtenida del reporte PSI o el valor por defecto 'hgaruna.org'
prompt = f"""
Analiza el siguiente reporte de Google PageSpeed Insights para el sitio {site_url}.

Puntuación de Rendimiento Global (móvil): {performance_score * 100 if performance_score else 'N/A'}.

Principales Oportunidades y Diagnósticos (resumido para concisión y eficiencia de tokens):
{json.dumps(opportunities, indent=2, ensure_ascii=False)[:6000]} # Aumentado el límite a 6000 caracteres

Identifica las 3-5 principales oportunidades de mejora que tendrían el mayor impacto en el rendimiento.
Para cada oportunidad:
1.  Explica el problema en lenguaje claro y conciso.
2.  Ofrece una solución específica a nivel de código o configuración, idealmente con ejemplos de código (para un sitio web HTML/CSS/JS).
3.  Prioriza las soluciones por su potencial impacto.
Considera que el sitio está desplegado en Netlify y el contenido se sirve desde una carpeta 'public'.

Por favor, proporciona las sugerencias en español.
"""

# --- Usar el modelo gemini-1.5-flash ---
model = genai.GenerativeModel('gemini-1.5-flash')

# Generar la respuesta
try:
    response = model.generate_content(prompt)
    gemini_output = response.text
except Exception as e:
    gemini_output = f"Error al generar respuesta de Gemini: {e}"
    print(gemini_output) # Imprimir el error para depuración
    sys.exit(1)

# Guardar la respuesta de Gemini en un archivo
with open(gemini_output_path, 'w', encoding='utf-8') as f: # Añadido encoding
    f.write(gemini_output)

# Establecer la salida para GitHub Actions
if github_output_path:
    with open(github_output_path, 'a', encoding='utf-8') as f: # Añadido encoding
        f.write(f'gemini_suggestions={json.dumps(gemini_output)}\n')

print(f"Análisis de Gemini guardado en {gemini_output_path}")
print(f"Salida de Gemini para GHA: {json.dumps(gemini_output)[:100]}...") # Imprimir un extracto para depuración
