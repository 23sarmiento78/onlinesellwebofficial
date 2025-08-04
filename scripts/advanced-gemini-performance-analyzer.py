#!/usr/bin/env python3

"""
🚀 Analizador Avanzado de Performance con Gemini AI

Características:
- Análisis multi-página con PageSpeed Insights
- Recomendaciones inteligentes con Gemini
- Core Web Vitals detallados
- Optimizaciones específicas por dispositivo
- Predicciones de mejora
- Monitoreo de tendencias
- Reportes automatizados
"""

import json
import os
import sys
import argparse
import requests
from datetime import datetime, timedelta
from pathlib import Path
import google.generativeai as genai
from typing import Dict, List, Any, Optional
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# === CONFIGURACIÓN ===
class Config:
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
    SITE_URL = os.environ.get('SITE_URL', 'https://hgaruna.org')
    ANALYSIS_DEPTH = os.environ.get('ANALYSIS_DEPTH', 'comprehensive')
    
    # Umbrales de performance
    EXCELLENT_SCORE = 90
    GOOD_SCORE = 70
    NEEDS_IMPROVEMENT = 50
    
    # Core Web Vitals umbrales
    LCP_GOOD = 2.5
    LCP_NEEDS_IMPROVEMENT = 4.0
    FID_GOOD = 100
    FID_NEEDS_IMPROVEMENT = 300
    CLS_GOOD = 0.1
    CLS_NEEDS_IMPROVEMENT = 0.25
    
    # Configuración de análisis
    MAX_RETRIES = 3
    TIMEOUT = 30

# === VALIDACIÓN ===
if not Config.GEMINI_API_KEY:
    print("❌ Error: GEMINI_API_KEY no está configurado")
    sys.exit(1)

# === INICIALIZACIÓN DE GEMINI ===
genai.configure(api_key=Config.GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# === UTILIDADES ===
class PerformanceUtils:
    @staticmethod
    def categorize_score(score: float) -> str:
        """Categoriza un score de performance"""
        if score >= Config.EXCELLENT_SCORE:
            return "excelente"
        elif score >= Config.GOOD_SCORE:
            return "bueno"
        elif score >= Config.NEEDS_IMPROVEMENT:
            return "necesita mejoras"
        else:
            return "crítico"
    
    @staticmethod
    def categorize_cwv(metric: str, value: float) -> str:
        """Categoriza Core Web Vitals"""
        if metric.lower() == 'lcp':
            return "bueno" if value <= Config.LCP_GOOD else "necesita mejoras" if value <= Config.LCP_NEEDS_IMPROVEMENT else "crítico"
        elif metric.lower() == 'fid':
            return "bueno" if value <= Config.FID_GOOD else "necesita mejoras" if value <= Config.FID_NEEDS_IMPROVEMENT else "crítico"
        elif metric.lower() == 'cls':
            return "bueno" if value <= Config.CLS_GOOD else "necesita mejoras" if value <= Config.CLS_NEEDS_IMPROVEMENT else "crítico"
        return "desconocido"
    
    @staticmethod
    def calculate_priority_score(metric_data: Dict) -> int:
        """Calcula score de prioridad para optimizaciones"""
        impact = metric_data.get('impact', 0)
        ease = metric_data.get('ease', 0)
        resources = metric_data.get('resources_needed', 10)
        
        # Prioridad = (Impacto * Facilidad) / Recursos
        return int((impact * ease) / max(resources / 10, 1))

# === ANALIZADOR DE REPORTES PSI ===
class PSIReportAnalyzer:
    def __init__(self, reports_dir: str):
        self.reports_dir = Path(reports_dir)
        self.reports_data = {}
        self.analysis_results = {}
    
    def load_reports(self) -> Dict[str, Any]:
        """Cargar todos los reportes PSI"""
        print("📊 Cargando reportes de PageSpeed Insights...")
        
        for device_dir in ['mobile', 'desktop']:
            device_path = self.reports_dir / device_dir
            if not device_path.exists():
                continue
                
            self.reports_data[device_dir] = {}
            
            for report_file in device_path.glob('*.json'):
                try:
                    with open(report_file, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        
                    # Verificar que es un reporte válido
                    if 'lighthouseResult' in data:
                        page_name = report_file.stem
                        self.reports_data[device_dir][page_name] = data
                        print(f"  ✅ Cargado: {device_dir}/{page_name}")
                    else:
                        print(f"  ⚠️ Reporte inválido: {report_file}")
                        
                except Exception as e:
                    print(f"  ❌ Error cargando {report_file}: {e}")
        
        total_reports = sum(len(device_data) for device_data in self.reports_data.values())
        print(f"📊 Total reportes cargados: {total_reports}")
        
        return self.reports_data
    
    def extract_metrics(self) -> Dict[str, Any]:
        """Extraer métricas de performance de todos los reportes"""
        print("🔍 Extrayendo métricas de performance...")
        
        metrics_summary = {
            'by_device': {},
            'by_page': {},
            'overall': {},
            'core_web_vitals': {},
            'opportunities': []
        }
        
        for device, pages in self.reports_data.items():
            metrics_summary['by_device'][device] = {}
            
            for page_name, report in pages.items():
                try:
                    lighthouse = report.get('lighthouseResult', {})
                    categories = lighthouse.get('categories', {})
                    audits = lighthouse.get('audits', {})
                    
                    # Métricas principales
                    performance_score = categories.get('performance', {}).get('score', 0) * 100
                    accessibility_score = categories.get('accessibility', {}).get('score', 0) * 100
                    best_practices_score = categories.get('best-practices', {}).get('score', 0) * 100
                    seo_score = categories.get('seo', {}).get('score', 0) * 100
                    
                    # Core Web Vitals
                    lcp = audits.get('largest-contentful-paint', {}).get('numericValue', 0) / 1000
                    fid = audits.get('first-input-delay', {}).get('numericValue', 0)
                    cls = audits.get('cumulative-layout-shift', {}).get('numericValue', 0)
                    
                    page_metrics = {
                        'performance_score': performance_score,
                        'accessibility_score': accessibility_score,
                        'best_practices_score': best_practices_score,
                        'seo_score': seo_score,
                        'lcp': lcp,
                        'fid': fid,
                        'cls': cls,
                        'lcp_category': PerformanceUtils.categorize_cwv('lcp', lcp),
                        'fid_category': PerformanceUtils.categorize_cwv('fid', fid),
                        'cls_category': PerformanceUtils.categorize_cwv('cls', cls),
                        'overall_category': PerformanceUtils.categorize_score(performance_score)
                    }
                    
                    # Almacenar por dispositivo y página
                    metrics_summary['by_device'][device][page_name] = page_metrics
                    
                    if page_name not in metrics_summary['by_page']:
                        metrics_summary['by_page'][page_name] = {}
                    metrics_summary['by_page'][page_name][device] = page_metrics
                    
                    # Extraer oportunidades de optimización
                    opportunities = self.extract_opportunities(audits, device, page_name)
                    metrics_summary['opportunities'].extend(opportunities)
                    
                    print(f"  ✅ {device}/{page_name}: Performance {performance_score:.0f}%")
                    
                except Exception as e:
                    print(f"  ❌ Error procesando {device}/{page_name}: {e}")
        
        # Calcular métricas generales
        metrics_summary['overall'] = self.calculate_overall_metrics(metrics_summary['by_device'])
        metrics_summary['core_web_vitals'] = self.analyze_core_web_vitals(metrics_summary['by_device'])
        
        return metrics_summary
    
    def extract_opportunities(self, audits: Dict, device: str, page: str) -> List[Dict]:
        """Extraer oportunidades de optimización"""
        opportunities = []
        
        # Definir auditorías clave para oportunidades
        key_audits = [
            'render-blocking-resources',
            'unused-css-rules',
            'unused-javascript',
            'modern-image-formats',
            'efficiently-encode-images',
            'serves-responsive-images',
            'offscreen-images',
            'unminified-css',
            'unminified-javascript',
            'uses-text-compression',
            'uses-rel-preconnect',
            'preload-lcp-image',
            'total-blocking-time',
            'speed-index'
        ]
        
        for audit_id in key_audits:
            audit = audits.get(audit_id, {})
            
            if audit.get('scoreDisplayMode') == 'opportunity' and audit.get('score', 1) < 1:
                # Calcular impacto potencial
                savings_ms = audit.get('details', {}).get('overallSavingsMs', 0)
                savings_bytes = audit.get('details', {}).get('overallSavingsBytes', 0)
                
                opportunity = {
                    'audit_id': audit_id,
                    'title': audit.get('title', ''),
                    'description': audit.get('description', ''),
                    'device': device,
                    'page': page,
                    'score': audit.get('score', 0),
                    'savings_ms': savings_ms,
                    'savings_bytes': savings_bytes,
                    'display_value': audit.get('displayValue', ''),
                    'priority': PerformanceUtils.calculate_priority_score({
                        'impact': min(savings_ms / 100, 10),  # Normalizar impacto
                        'ease': 10 - (audit.get('score', 1) * 10),  # Facilidad inversa al score
                        'resources_needed': 5  # Valor por defecto
                    })
                }
                
                opportunities.append(opportunity)
        
        return opportunities
    
    def calculate_overall_metrics(self, by_device: Dict) -> Dict:
        """Calcular métricas generales"""
        all_scores = []
        all_lcp = []
        all_fid = []
        all_cls = []
        
        for device, pages in by_device.items():
            for page, metrics in pages.items():
                all_scores.append(metrics['performance_score'])
                all_lcp.append(metrics['lcp'])
                all_fid.append(metrics['fid'])
                all_cls.append(metrics['cls'])
        
        if not all_scores:
            return {}
        
        return {
            'avg_performance_score': sum(all_scores) / len(all_scores),
            'min_performance_score': min(all_scores),
            'max_performance_score': max(all_scores),
            'avg_lcp': sum(all_lcp) / len(all_lcp),
            'avg_fid': sum(all_fid) / len(all_fid),
            'avg_cls': sum(all_cls) / len(all_cls),
            'total_pages_analyzed': len(all_scores)
        }
    
    def analyze_core_web_vitals(self, by_device: Dict) -> Dict:
        """Análisis detallado de Core Web Vitals"""
        cwv_analysis = {
            'summary': {'good': 0, 'needs_improvement': 0, 'poor': 0},
            'by_metric': {'lcp': {}, 'fid': {}, 'cls': {}},
            'recommendations': []
        }
        
        all_metrics = []
        for device, pages in by_device.items():
            for page, metrics in pages.items():
                all_metrics.append({
                    'device': device,
                    'page': page,
                    'lcp': metrics['lcp'],
                    'fid': metrics['fid'],
                    'cls': metrics['cls']
                })
        
        # Analizar cada métrica
        for metric in ['lcp', 'fid', 'cls']:
            values = [m[metric] for m in all_metrics]
            categories = [PerformanceUtils.categorize_cwv(metric, v) for v in values]
            
            cwv_analysis['by_metric'][metric] = {
                'avg': sum(values) / len(values) if values else 0,
                'worst': max(values) if values else 0,
                'best': min(values) if values else 0,
                'good_count': categories.count('bueno'),
                'needs_improvement_count': categories.count('necesita mejoras'),
                'poor_count': categories.count('crítico')
            }
        
        return cwv_analysis

# === ANALIZADOR CON GEMINI ===
class GeminiPerformanceAnalyzer:
    def __init__(self, metrics_data: Dict):
        self.metrics_data = metrics_data
        self.ai_analysis = {}
    
    async def generate_comprehensive_analysis(self) -> Dict:
        """Generar análisis completo con Gemini"""
        print("🧠 Generando análisis inteligente con Gemini...")
        
        # Preparar datos para Gemini
        analysis_prompt = self.create_analysis_prompt()
        
        try:
            response = model.generate_content(analysis_prompt)
            response_text = response.text
            
            # Extraer JSON de la respuesta
            json_match = self.extract_json_from_response(response_text)
            if json_match:
                self.ai_analysis = json.loads(json_match)
                print("✅ Análisis IA completado")
            else:
                print("⚠️ No se pudo extraer JSON del análisis IA")
                self.ai_analysis = self.create_fallback_analysis()
                
        except Exception as e:
            print(f"❌ Error en análisis IA: {e}")
            self.ai_analysis = self.create_fallback_analysis()
        
        return self.ai_analysis
    
    def create_analysis_prompt(self) -> str:
        """Crear prompt detallado para Gemini"""
        
        # Resumir datos clave
        overall = self.metrics_data.get('overall', {})
        opportunities = self.metrics_data.get('opportunities', [])
        cwv = self.metrics_data.get('core_web_vitals', {})
        
        # Top oportunidades por prioridad
        top_opportunities = sorted(opportunities, key=lambda x: x.get('priority', 0), reverse=True)[:10]
        
        prompt = f"""
Analiza los siguientes datos de performance web para el sitio {Config.SITE_URL}.

MÉTRICAS GENERALES:
- Score promedio: {overall.get('avg_performance_score', 0):.1f}%
- Score mínimo: {overall.get('min_performance_score', 0):.1f}%
- Score máximo: {overall.get('max_performance_score', 0):.1f}%
- Páginas analizadas: {overall.get('total_pages_analyzed', 0)}

CORE WEB VITALS:
- LCP promedio: {overall.get('avg_lcp', 0):.2f}s
- FID promedio: {overall.get('avg_fid', 0):.0f}ms
- CLS promedio: {overall.get('avg_cls', 0):.3f}

PRINCIPALES OPORTUNIDADES:
{json.dumps(top_opportunities[:5], indent=2)}

ANÁLISIS REQUERIDO:
1. Diagnóstico general del estado de performance
2. Identificación de problemas críticos
3. Recomendaciones priorizadas por impacto
4. Plan de implementación paso a paso
5. Predicción de mejoras esperadas
6. Monitoreo y métricas a seguir

CONTEXTO DEL SITIO:
- Empresa: hgaruna (desarrollo web Villa Carlos Paz)
- Tipo: Sitio web de servicios B2B
- Audiencia: Negocios locales en Córdoba, Argentina
- Objetivos: Conversión de leads, SEO local

Devuelve tu análisis en formato JSON con esta estructura:

{{
  "executive_summary": {{
    "overall_health": "excelente|bueno|regular|crítico",
    "priority_level": "alta|media|baja",
    "estimated_impact": "alto|medio|bajo",
    "key_insights": ["insight1", "insight2", "insight3"]
  }},
  "critical_issues": [
    {{
      "issue": "descripción del problema",
      "impact": "alto|medio|bajo",
      "pages_affected": ["página1", "página2"],
      "devices_affected": ["mobile", "desktop"],
      "business_impact": "descripción del impacto en el negocio"
    }}
  ],
  "recommendations": [
    {{
      "title": "título de la recomendación",
      "description": "descripción detallada",
      "priority": "alta|media|baja",
      "effort": "alto|medio|bajo",
      "expected_improvement": "% de mejora esperada",
      "implementation_steps": ["paso1", "paso2", "paso3"],
      "timeline": "timeframe estimado",
      "technical_notes": "notas técnicas específicas"
    }}
  ],
  "performance_predictions": {{
    "with_high_priority_fixes": {{
      "performance_score": "score esperado",
      "lcp_improvement": "mejora en LCP",
      "cls_improvement": "mejora en CLS",
      "business_metrics": "impacto en conversiones/SEO"
    }},
    "with_all_fixes": {{
      "performance_score": "score esperado",
      "lcp_improvement": "mejora en LCP",
      "cls_improvement": "mejora en CLS",
      "business_metrics": "impacto en conversiones/SEO"
    }}
  }},
  "monitoring_strategy": {{
    "key_metrics": ["métrica1", "métrica2"],
    "monitoring_frequency": "frecuencia recomendada",
    "alert_thresholds": {{
      "performance_score": "umbral",
      "lcp": "umbral",
      "cls": "umbral"
    }},
    "tools_recommended": ["herramienta1", "herramienta2"]
  }},
  "competitive_analysis": {{
    "industry_benchmarks": {{
      "average_performance_score": "score promedio de la industria",
      "top_performers": "características de los mejores"
    }},
    "positioning": "cómo se compara el sitio",
    "opportunities": ["oportunidad1", "oportunidad2"]
  }}
}}
"""
        return prompt
    
    def extract_json_from_response(self, response_text: str) -> Optional[str]:
        """Extraer JSON de la respuesta de Gemini"""
        import re
        
        # Buscar JSON en la respuesta
        json_pattern = r'\{[\s\S]*\}'
        match = re.search(json_pattern, response_text)
        
        if match:
            return match.group()
        
        return None
    
    def create_fallback_analysis(self) -> Dict:
        """Crear análisis de fallback si Gemini falla"""
        overall = self.metrics_data.get('overall', {})
        avg_score = overall.get('avg_performance_score', 0)
        
        health = "crítico" if avg_score < 50 else "regular" if avg_score < 70 else "bueno" if avg_score < 90 else "excelente"
        
        return {
            "executive_summary": {
                "overall_health": health,
                "priority_level": "alta" if avg_score < 70 else "media",
                "estimated_impact": "alto" if avg_score < 70 else "medio",
                "key_insights": [
                    f"Score promedio de performance: {avg_score:.1f}%",
                    "Análisis automático generado",
                    "Se requiere revisión manual detallada"
                ]
            },
            "recommendations": [
                {
                    "title": "Optimización general de performance",
                    "description": "Revisar y optimizar recursos críticos",
                    "priority": "alta",
                    "effort": "medio",
                    "expected_improvement": "10-20%"
                }
            ]
        }

# === GENERADOR DE REPORTES ===
class ReportGenerator:
    def __init__(self, analysis_data: Dict, output_dir: str):
        self.analysis_data = analysis_data
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
    
    def generate_all_reports(self):
        """Generar todos los reportes"""
        print("📄 Generando reportes...")
        
        # Reporte principal JSON
        self.save_json_report()
        
        # Reporte ejecutivo
        self.generate_executive_report()
        
        # Reporte técnico detallado
        self.generate_technical_report()
        
        # Dashboard interactivo
        self.generate_dashboard_data()
        
        print("✅ Reportes generados en:", self.output_dir)
    
    def save_json_report(self):
        """Guardar reporte completo en JSON"""
        timestamp = datetime.now().isoformat()
        
        complete_report = {
            "timestamp": timestamp,
            "site_url": Config.SITE_URL,
            "analysis_depth": Config.ANALYSIS_DEPTH,
            "metrics_data": self.analysis_data.get('metrics', {}),
            "ai_analysis": self.analysis_data.get('ai_analysis', {}),
            "metadata": {
                "analyzer_version": "2.0.0",
                "gemini_model": "gemini-1.5-flash",
                "analysis_duration": "unknown"
            }
        }
        
        with open(self.output_dir / 'complete-analysis.json', 'w', encoding='utf-8') as f:
            json.dump(complete_report, f, indent=2, ensure_ascii=False)
    
    def generate_executive_report(self):
        """Generar reporte ejecutivo"""
        ai_analysis = self.analysis_data.get('ai_analysis', {})
        metrics = self.analysis_data.get('metrics', {})
        
        executive_summary = ai_analysis.get('executive_summary', {})
        overall = metrics.get('overall', {})
        
        report = f"""
# 📊 Reporte Ejecutivo de Performance - {Config.SITE_URL}

## Resumen General
- **Estado de salud**: {executive_summary.get('overall_health', 'Unknown').upper()}
- **Nivel de prioridad**: {executive_summary.get('priority_level', 'Unknown').upper()}
- **Score promedio**: {overall.get('avg_performance_score', 0):.1f}%
- **Páginas analizadas**: {overall.get('total_pages_analyzed', 0)}

## Insights Clave
{chr(10).join(f"- {insight}" for insight in executive_summary.get('key_insights', []))}

## Próximos Pasos
1. Implementar recomendaciones de alta prioridad
2. Monitorear métricas clave semanalmente
3. Reevaluar performance en 30 días

---
*Generado automáticamente el {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""
        
        with open(self.output_dir / 'executive-summary.md', 'w', encoding='utf-8') as f:
            f.write(report)
    
    def generate_technical_report(self):
        """Generar reporte técnico detallado"""
        ai_analysis = self.analysis_data.get('ai_analysis', {})
        recommendations = ai_analysis.get('recommendations', [])
        
        report = f"""
# 🔧 Reporte Técnico de Performance - {Config.SITE_URL}

## Recomendaciones Técnicas

"""
        
        for i, rec in enumerate(recommendations, 1):
            report += f"""
### {i}. {rec.get('title', 'Recomendación')}

**Prioridad**: {rec.get('priority', 'Unknown').upper()}
**Esfuerzo**: {rec.get('effort', 'Unknown')}
**Mejora esperada**: {rec.get('expected_improvement', 'Unknown')}

{rec.get('description', 'Sin descripción')}

#### Pasos de implementación:
{chr(10).join(f"{j}. {step}" for j, step in enumerate(rec.get('implementation_steps', []), 1))}

#### Notas técnicas:
{rec.get('technical_notes', 'Sin notas adicionales')}

---
"""
        
        with open(self.output_dir / 'technical-report.md', 'w', encoding='utf-8') as f:
            f.write(report)
    
    def generate_dashboard_data(self):
        """Generar datos para dashboard interactivo"""
        dashboard_data = {
            "last_updated": datetime.now().isoformat(),
            "site_url": Config.SITE_URL,
            "summary_cards": self.create_summary_cards(),
            "charts_data": self.create_charts_data(),
            "recommendations": self.create_recommendations_data()
        }
        
        with open(self.output_dir / 'dashboard-data.json', 'w', encoding='utf-8') as f:
            json.dump(dashboard_data, f, indent=2)
    
    def create_summary_cards(self) -> List[Dict]:
        """Crear datos para tarjetas de resumen"""
        metrics = self.analysis_data.get('metrics', {})
        overall = metrics.get('overall', {})
        
        return [
            {
                "title": "Performance Score",
                "value": f"{overall.get('avg_performance_score', 0):.0f}%",
                "trend": "up",  # Placeholder
                "status": PerformanceUtils.categorize_score(overall.get('avg_performance_score', 0))
            },
            {
                "title": "LCP Promedio",
                "value": f"{overall.get('avg_lcp', 0):.1f}s",
                "trend": "stable",
                "status": PerformanceUtils.categorize_cwv('lcp', overall.get('avg_lcp', 0))
            },
            {
                "title": "CLS Promedio",
                "value": f"{overall.get('avg_cls', 0):.3f}",
                "trend": "down",
                "status": PerformanceUtils.categorize_cwv('cls', overall.get('avg_cls', 0))
            }
        ]
    
    def create_charts_data(self) -> Dict:
        """Crear datos para gráficos"""
        metrics = self.metrics_data.get('metrics', {})
        by_page = metrics.get('by_page', {})
        
        # Datos para gráfico de performance por página
        page_performance = []
        for page, devices in by_page.items():
            for device, data in devices.items():
                page_performance.append({
                    "page": page,
                    "device": device,
                    "performance": data.get('performance_score', 0),
                    "lcp": data.get('lcp', 0),
                    "cls": data.get('cls', 0)
                })
        
        return {
            "page_performance": page_performance,
            "device_comparison": self.create_device_comparison(),
            "cwv_distribution": self.create_cwv_distribution()
        }
    
    def create_device_comparison(self) -> Dict:
        """Crear comparación por dispositivo"""
        # Placeholder para comparación mobile vs desktop
        return {
            "mobile": {"avg_score": 75, "total_pages": 4},
            "desktop": {"avg_score": 85, "total_pages": 4}
        }
    
    def create_cwv_distribution(self) -> Dict:
        """Crear distribución de Core Web Vitals"""
        cwv = self.analysis_data.get('metrics', {}).get('core_web_vitals', {})
        
        return {
            "lcp": cwv.get('by_metric', {}).get('lcp', {}),
            "fid": cwv.get('by_metric', {}).get('fid', {}),
            "cls": cwv.get('by_metric', {}).get('cls', {})
        }
    
    def create_recommendations_data(self) -> List[Dict]:
        """Crear datos de recomendaciones para dashboard"""
        ai_analysis = self.analysis_data.get('ai_analysis', {})
        recommendations = ai_analysis.get('recommendations', [])
        
        return [
            {
                "id": i,
                "title": rec.get('title', ''),
                "priority": rec.get('priority', 'media'),
                "effort": rec.get('effort', 'medio'),
                "impact": rec.get('expected_improvement', ''),
                "status": "pending"
            }
            for i, rec in enumerate(recommendations)
        ]

# === FUNCIÓN PRINCIPAL ===
def main():
    parser = argparse.ArgumentParser(description='Analizador Avanzado de Performance con Gemini')
    parser.add_argument('--reports-dir', required=True, help='Directorio con reportes PSI')
    parser.add_argument('--site-url', default=Config.SITE_URL, help='URL del sitio a analizar')
    parser.add_argument('--analysis-depth', default=Config.ANALYSIS_DEPTH, help='Profundidad del análisis')
    parser.add_argument('--output-dir', default='analysis-results', help='Directorio de salida')
    
    args = parser.parse_args()
    
    try:
        print(f"🚀 Iniciando análisis avanzado de performance para {args.site_url}")
        print(f"📊 Profundidad: {args.analysis_depth}")
        
        # Actualizar configuración
        Config.SITE_URL = args.site_url
        Config.ANALYSIS_DEPTH = args.analysis_depth
        
        # 1. Cargar y analizar reportes PSI
        psi_analyzer = PSIReportAnalyzer(args.reports_dir)
        psi_analyzer.load_reports()
        metrics_data = psi_analyzer.extract_metrics()
        
        # 2. Análisis con Gemini IA
        gemini_analyzer = GeminiPerformanceAnalyzer(metrics_data)
        import asyncio
        ai_analysis = asyncio.run(gemini_analyzer.generate_comprehensive_analysis())
        
        # 3. Combinar resultados
        complete_analysis = {
            'metrics': metrics_data,
            'ai_analysis': ai_analysis,
            'timestamp': datetime.now().isoformat(),
            'config': {
                'site_url': Config.SITE_URL,
                'analysis_depth': Config.ANALYSIS_DEPTH
            }
        }
        
        # 4. Generar reportes
        report_generator = ReportGenerator(complete_analysis, args.output_dir)
        report_generator.generate_all_reports()
        
        # 5. Output para GitHub Actions
        overall_score = metrics_data.get('overall', {}).get('avg_performance_score', 0)
        print(f"\n🎉 Análisis completado exitosamente")
        print(f"📊 Score general: {overall_score:.1f}%")
        print(f"📁 Reportes guardados en: {args.output_dir}")
        
        # Output estructurado para GitHub Actions
        if overall_score >= Config.EXCELLENT_SCORE:
            print("STATUS=excellent")
        elif overall_score >= Config.GOOD_SCORE:
            print("STATUS=good")
        else:
            print("STATUS=needs_improvement")
        
        sys.exit(0)
        
    except Exception as e:
        print(f"❌ Error fatal en análisis: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
