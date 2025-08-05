import { useState, useEffect } from 'react'
import { saveArticleToFile, getSavedArticleFiles, generateSlug } from '@utils/articleFileSystem'
import { autoUpdateSitemap } from '@utils/sitemapUpdater'
import { initializeArticles } from '@utils/articleLoader'
import { initializeStyleUpdates } from '@utils/updateArticleStyles'

// Mock articles database (in a real app, this would be a database or API)
const MOCK_ARTICLES = [
  {
    id: 1,
    title: 'React 19: Las Nuevas Características que Cambiarán Todo',
    excerpt: 'Explora las innovaciones más importantes de React 19 y cómo impactarán en el desarrollo frontend moderno.',
    slug: 'react-19-nuevas-caracteristicas',
    category: 'desarrollo',
    date: '2024-01-15',
    readTime: '8 min',
    author: 'hgaruna',
    tags: ['React', 'Frontend', 'JavaScript', 'Desarrollo'],
    image: '/logos-he-imagenes/programacion.jpeg',
    featured: true,
    content: `
# React 19: Las Nuevas Características que Cambiarán Todo

React 19 está por llegar y trae consigo una serie de características revolucionarias que cambiarán la forma en que desarrollamos aplicaciones frontend. En este artículo, exploraremos las innovaciones más importantes y cómo implementarlas en tus proyectos.

## Server Components: El Futuro del Rendering

Los Server Components representan uno de los cambios más significativos en React 19. Esta funcionalidad permite que los componentes se ejecuten en el servidor, reduciendo el bundle size y mejorando el performance.

\`\`\`jsx
// Server Component
async function UserProfile({ userId }) {
  const user = await fetchUser(userId);
  
  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
\`\`\`

## Concurrent Features Mejoradas

React 19 mejora significativamente las características concurrentes introducidas en versiones anteriores, proporcionando mejor control sobre la prioridad de las actualizaciones.

### useTransition Optimizado

\`\`\`jsx
import { useTransition, useState } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    startTransition(() => {
      // Esta actualización tendrá menor prioridad
      setResults(searchDatabase(newQuery));
    });
  };

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Buscar..."
      />
      {isPending && <div>Buscando...</div>}
      <ResultsList results={results} />
    </div>
  );
}
\`\`\`

## Automatic Batching Extendido

React 19 extiende el automatic batching a todas las actualizaciones de estado, incluyendo promesas, timeouts y event handlers nativos.

## Suspense para Data Fetching

El Suspense API se ha mejorado para trabajar mejor con el data fetching, proporcionando una experiencia más fluida para el usuario.

\`\`\`jsx
function UserData({ userId }) {
  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserProfile userId={userId} />
      <UserPosts userId={userId} />
    </Suspense>
  );
}
\`\`\`

## Conclusión

React 19 marca un hito importante en la evolución del framework, con características que mejorarán significativamente tanto la experiencia del desarrollador como el performance de las aplicaciones. Es hora de empezar a experimentar con estas nuevas funcionalidades.

---

*Este artículo fue escrito por hgaruna. Para más contenido sobre desarrollo web y tecnología, sigue nuestro blog.*
    `
  },
  {
    id: 2,
    title: 'TypeScript Avanzado: Patrones y Técnicas Pro',
    excerpt: 'Domina TypeScript con patrones avanzados, utility types y técnicas que todo desarrollador debe conocer.',
    slug: 'typescript-avanzado-patrones',
    category: 'programacion',
    date: '2024-01-12',
    readTime: '12 min',
    author: 'hgaruna',
    tags: ['TypeScript', 'JavaScript', 'Programación', 'Tipos'],
    image: '/logos-he-imagenes/programacion.jpeg',
    featured: true,
    content: `
# TypeScript Avanzado: Patrones y Técnicas Pro

TypeScript ha evolucionado tremendamente en los últimos años, y conocer sus características avanzadas es esencial para cualquier desarrollador moderno. En esta guía completa, exploraremos patrones y técnicas avanzadas que elevarán tu código TypeScript al siguiente nivel.

## Utility Types Avanzados

Los utility types son una de las características más poderosas de TypeScript. Permiten transformar tipos existentes en nuevos tipos de manera declarativa.

### Pick y Omit para Composición de Tipos

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Seleccionar solo ciertos campos
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

// Omitir campos sensibles
type UserWithoutPassword = Omit<User, 'password'>;

// Crear tipos para diferentes contextos
type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateUserInput = Partial<Pick<User, 'name' | 'email'>>;
\`\`\`

### Conditional Types para Lógica de Tipos

\`\`\`typescript
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : T extends number 
    ? { count: T }
    : { data: T };

// Uso
type StringResponse = ApiResponse<string>; // { message: string }
type NumberResponse = ApiResponse<number>; // { count: number }
type ObjectResponse = ApiResponse<User>; // { data: User }
\`\`\`

## Mapped Types Avanzados

Los mapped types permiten crear nuevos tipos basados en tipos existentes de manera programática.

\`\`\`typescript
// Hacer todos los campos opcionales y nullable
type PartialNullable<T> = {
  [P in keyof T]?: T[P] | null;
};

// Crear tipos de validación
type ValidationErrors<T> = {
  [P in keyof T]?: string[];
};

// Tipo para formularios
type FormState<T> = {
  values: PartialNullable<T>;
  errors: ValidationErrors<T>;
  touched: { [P in keyof T]?: boolean };
};
\`\`\`

## Patrones de Design con TypeScript

### Factory Pattern con Tipos Genéricos

\`\`\`typescript
interface Repository<T> {
  find(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

class GenericRepository<T extends { id: string }> implements Repository<T> {
  constructor(private collection: string) {}
  
  async find(id: string): Promise<T | null> {
    // Implementación
    return null;
  }
  
  // ... otras implementaciones
}

// Uso específico
const userRepository = new GenericRepository<User>('users');
const postRepository = new GenericRepository<Post>('posts');
\`\`\`

### Builder Pattern Tipado

\`\`\`typescript
class QueryBuilder<T> {
  private filters: Array<(item: T) => boolean> = [];
  private sortField?: keyof T;
  private limitValue?: number;

  where<K extends keyof T>(field: K, value: T[K]): QueryBuilder<T> {
    this.filters.push((item) => item[field] === value);
    return this;
  }

  sort<K extends keyof T>(field: K): QueryBuilder<T> {
    this.sortField = field;
    return this;
  }

  limit(count: number): QueryBuilder<T> {
    this.limitValue = count;
    return this;
  }

  execute(data: T[]): T[] {
    let result = data.filter(item => 
      this.filters.every(filter => filter(item))
    );

    if (this.sortField) {
      result = result.sort((a, b) => 
        a[this.sortField!] > b[this.sortField!] ? 1 : -1
      );
    }

    if (this.limitValue) {
      result = result.slice(0, this.limitValue);
    }

    return result;
  }
}

// Uso
const users = new QueryBuilder<User>()
  .where('status', 'active')
  .sort('createdAt')
  .limit(10)
  .execute(allUsers);
\`\`\`

## Template Literal Types

Una de las características más innovadoras de TypeScript moderno.

\`\`\`typescript
// Crear tipos de rutas tipadas
type Route = '/users' | '/posts' | '/comments';
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = \`\${Method} \${Route}\`;

// Resultado: 'GET /users' | 'POST /users' | ... etc

// Sistema de eventos tipado
type EventName = 'user' | 'post' | 'comment';
type Action = 'created' | 'updated' | 'deleted';
type EventType = \`\${EventName}:\${Action}\`;

interface EventEmitter {
  on(event: EventType, callback: (data: any) => void): void;
  emit(event: EventType, data: any): void;
}
\`\`\`

## Decorators y Metadata

\`\`\`typescript
// Decorator para validación
function Required(target: any, propertyKey: string) {
  const existingValidators = Reflect.getMetadata('validators', target) || [];
  existingValidators.push({
    property: propertyKey,
    validator: (value: any) => value !== undefined && value !== null
  });
  Reflect.defineMetadata('validators', existingValidators, target);
}

class CreateUserDTO {
  @Required
  name!: string;

  @Required
  email!: string;

  password!: string;
}
\`\`\`

## Mejores Prácticas

### Usar const assertions para mayor precisión

\`\`\`typescript
// En lugar de
const colors = ['red', 'green', 'blue']; // string[]

// Usar
const colors = ['red', 'green', 'blue'] as const; // readonly ['red', 'green', 'blue']
type Color = typeof colors[number]; // 'red' | 'green' | 'blue'
\`\`\`

### Discriminated Unions para manejo de estados

\`\`\`typescript
type LoadingState = { status: 'loading' };
type SuccessState = { status: 'success'; data: any };
type ErrorState = { status: 'error'; error: string };

type AsyncState = LoadingState | SuccessState | ErrorState;

function handleState(state: AsyncState) {
  switch (state.status) {
    case 'loading':
      // TypeScript sabe que solo tiene 'status'
      break;
    case 'success':
      // TypeScript sabe que tiene 'data'
      console.log(state.data);
      break;
    case 'error':
      // TypeScript sabe que tiene 'error'
      console.error(state.error);
      break;
  }
}
\`\`\`

## Conclusión

TypeScript avanzado abre un mundo de posibilidades para crear código más robusto, mantenible y expresivo. Estos patrones y técnicas te ayudarán a aprovechar al máximo el sistema de tipos de TypeScript.

Los próximos pasos incluyen experimentar con estos patrones en tus propios proyectos y explorar características aún más avanzadas como Higher-Kinded Types y el sistema de módulos.

---

*Este artículo fue escrito por hgaruna. Para más contenido sobre programación y desarrollo web, sigue nuestro blog.*
    `
  },
  {
    id: 3,
    title: 'IA en el Desarrollo Web: Tendencias 2024',
    excerpt: 'Cómo la inteligencia artificial está transformando el desarrollo web y qué esperar este año.',
    slug: 'ia-desarrollo-web-2024',
    category: 'ia',
    date: '2024-01-10',
    readTime: '15 min',
    author: 'hgaruna',
    tags: ['IA', 'Desarrollo Web', 'Tendencias', 'Automatización'],
    image: '/logos-he-imagenes/programacion.jpeg',
    featured: true,
    content: `
# IA en el Desarrollo Web: Tendencias 2024

La inteligencia artificial ha dejado de ser una promesa futurista para convertirse en una realidad tangible que está transformando radicalmente el desarrollo web. En 2024, estamos viendo una adopción masiva de herramientas de IA que están cambiando la forma en que creamos, mantenemos y optimizamos aplicaciones web.

## Generación de Código Automatizada

### GitHub Copilot y Competidores

GitHub Copilot ha marcado el camino, pero 2024 trae una nueva generación de asistentes de código más inteligentes y especializados.

\`\`\`javascript
// Ejemplo de código generado por IA
function optimizeImageSizes(images) {
  return images.map(img => ({
    ...img,
    sizes: generateResponsiveSizes(img.dimensions),
    webp: convertToWebP(img.src),
    lazy: shouldLazyLoad(img.position)
  }));
}
\`\`\`

### CodeWhisperer y Alternatives

Amazon CodeWhisperer y otras herramientas están especializándose en diferentes nichos:
- **Backend development**: Optimización de consultas de base de datos
- **Frontend**: Generación de componentes UI responsivos
- **DevOps**: Automatización de pipelines CI/CD

## Diseño UI/UX Asistido por IA

### Herramientas de Diseño Inteligente

Las herramientas de diseño están incorporando IA para:

\`\`\`css
/* Estilos generados automáticamente por IA */
.adaptive-component {
  /* IA analiza el contexto y genera estilos óptimos */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: clamp(1rem, 4vw, 2rem);
  
  /* Optimización automática para diferentes dispositivos */
  container-type: inline-size;
}

@container (max-width: 600px) {
  .adaptive-component {
    grid-template-columns: 1fr;
  }
}
\`\`\`

### Personalización Dinámica

\`\`\`javascript
// Sistema de personalización basado en IA
class AIPersonalizationEngine {
  constructor(userId) {
    this.userId = userId;
    this.preferences = new UserPreferences(userId);
  }

  async generatePersonalizedLayout() {
    const userBehavior = await this.analyzeUserBehavior();
    const preferences = await this.preferences.getPreferences();
    
    return {
      layout: this.optimizeLayout(userBehavior),
      colors: this.adaptColors(preferences.colorProfile),
      content: this.prioritizeContent(userBehavior.interests)
    };
  }

  analyzeUserBehavior() {
    // Análisis de patrones de navegación, tiempo en página, clicks, etc.
    return AIAnalyzer.analyze(this.userId);
  }
}
\`\`\`

## Testing Automatizado Inteligente

### Generación Automática de Tests

\`\`\`javascript
// Tests generados por IA basados en el código fuente
describe('UserService', () => {
  // IA analiza el código y genera tests comprehensivos
  test('should handle user creation with validation', async () => {
    const userData = AITestDataGenerator.generateValidUser();
    const result = await userService.createUser(userData);
    
    expect(result).toMatchSchema(UserSchema);
    expect(result.id).toBeDefined();
  });

  test('should reject invalid email formats', async () => {
    const invalidEmails = AITestDataGenerator.generateInvalidEmails();
    
    for (const email of invalidEmails) {
      await expect(
        userService.createUser({ ...validUserData, email })
      ).rejects.toThrow('Invalid email format');
    }
  });
});
\`\`\`

### Visual Testing con IA

\`\`\`javascript
// Testing visual automatizado
const visualAI = new VisualTestingAI();

test('UI components render correctly across devices', async () => {
  const component = render(<UserProfile user={testUser} />);
  
  const screenshots = await visualAI.captureResponsiveScreenshots(component, {
    devices: ['mobile', 'tablet', 'desktop'],
    browsers: ['chrome', 'firefox', 'safari']
  });
  
  const analysis = await visualAI.analyzeVisualRegression(screenshots);
  expect(analysis.regressionScore).toBeLessThan(0.05);
});
\`\`\`

## Optimización de Performance con IA

### Bundle Analysis Inteligente

\`\`\`javascript
// Análisis automático de bundles
class AIBundleOptimizer {
  async analyzeBundles(bundleStats) {
    const analysis = await this.aiService.analyze(bundleStats);
    
    return {
      unusedDependencies: analysis.findUnusedDependencies(),
      duplicateCode: analysis.identifyDuplicates(),
      splitOpportunities: analysis.suggestCodeSplitting(),
      lazyLoadCandidates: analysis.findLazyLoadOpportunities()
    };
  }

  async generateOptimizationPlan(analysis) {
    return {
      immediate: analysis.quickWins,
      shortTerm: analysis.mediumEffortHighImpact,
      longTerm: analysis.architecturalChanges
    };
  }
}
\`\`\`

### Core Web Vitals Optimization

\`\`\`javascript
// Optimización automática de Core Web Vitals
class WebVitalsOptimizer {
  async optimizeLCP() {
    const criticalResources = await this.identifyCriticalResources();
    
    return {
      preloadHints: this.generatePreloadHints(criticalResources),
      imageOptimizations: this.optimizeImages(criticalResources.images),
      fontOptimizations: this.optimizeFonts(criticalResources.fonts)
    };
  }

  async optimizeCLS() {
    const layoutShifts = await this.detectLayoutShifts();
    
    return {
      reserveSpace: this.generateSpaceReservations(layoutShifts),
      fontFallbacks: this.generateFontFallbacks(),
      imageAspectRatios: this.calculateAspectRatios(layoutShifts.images)
    };
  }
}
\`\`\`

## Seguridad Potenciada por IA

### Detección de Vulnerabilidades

\`\`\`javascript
// Sistema de seguridad basado en IA
class AISecurityScanner {
  async scanCodebase(repository) {
    const vulnerabilities = await Promise.all([
      this.scanSQL Injection(),
      this.scanXSS(),
      this.scanCSRF(),
      this.scanDependencyVulnerabilities(),
      this.scanSecretsInCode()
    ]);

    return this.prioritizeVulnerabilities(vulnerabilities.flat());
  }

  async generateSecurityReport(vulnerabilities) {
    return {
      critical: vulnerabilities.filter(v => v.severity === 'critical'),
      recommendations: this.generateFixRecommendations(vulnerabilities),
      preventiveMeasures: this.suggestPreventiveMeasures()
    };
  }
}
\`\`\`

## Desarrollo Low-Code/No-Code con IA

### Generación de Aplicaciones desde Descripciones

\`\`\`javascript
// Generador de aplicaciones basado en IA
class AIAppGenerator {
  async generateFromDescription(description) {
    const parsed = await this.parseRequirements(description);
    
    return {
      dataModel: this.generateDataModel(parsed.entities),
      api: this.generateAPIEndpoints(parsed.operations),
      ui: this.generateUserInterface(parsed.ui_requirements),
      tests: this.generateTests(parsed)
    };
  }

  parseRequirements(description) {
    // Procesamiento de lenguaje natural para extraer requisitos
    return this.nlpService.extractRequirements(description);
  }
}
\`\`\`

## Herramientas y Frameworks Emergentes

### Vercel AI SDK

\`\`\`javascript
import { Configuration, OpenAIApi } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export async function POST(req) {
  const { prompt } = await req.json();
  
  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    stream: true,
    messages: [{ role: 'user', content: prompt }],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
\`\`\`

### LangChain para Desarrollo Web

\`\`\`javascript
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, SystemMessage } from 'langchain/schema';

const chat = new ChatOpenAI({ temperature: 0 });

const codeReviewer = async (code) => {
  const response = await chat.call([
    new SystemMessage('You are an expert code reviewer. Analyze the code for best practices, performance, and security.'),
    new HumanMessage(code)
  ]);

  return response.content;
};
\`\`\`

## Desafíos y Consideraciones Éticas

### Bias en IA y Inclusividad

Es crucial considerar los sesgos inherentes en los modelos de IA y trabajar activamente para crear herramientas más inclusivas y justas.

### Dependencia Tecnológica

El equilibrio entre la automatización y las habilidades humanas es fundamental para mantener la creatividad y el pensamiento crítico en el desarrollo.

## El Futuro del Desarrollo Web con IA

### Predicciones para 2024-2025

1. **Desarrollo Conversacional**: Programar mediante conversaciones naturales con IA
2. **Debugging Automático**: IA que identifica y corrige bugs automáticamente
3. **Arquitectura Adaptativa**: Sistemas que se auto-optimizan basados en el uso real
4. **Testing Predictivo**: IA que predice bugs antes de que ocurran

### Preparándose para el Cambio

\`\`\`javascript
// Framework de adaptación para desarrolladores
class DeveloperAIAdaptation {
  skills_to_develop = [
    'prompt_engineering',
    'ai_tool_integration',
    'human_ai_collaboration',
    'ethical_ai_development'
  ];

  async developAISkills() {
    return {
      learn: 'Prompt engineering y AI tool mastery',
      practice: 'Integration of AI in daily workflow',
      collaborate: 'Human-AI pair programming',
      ethics: 'Responsible AI development practices'
    };
  }
}
\`\`\`

## Conclusión

La IA no reemplazará a los desarrolladores web, pero los desarrolladores que usen IA efectivamente superarán a aquellos que no lo hagan. 2024 marca el año en que la IA se convierte en una herramienta esencial en el toolkit de todo desarrollador web.

La clave está en aprender a colaborar efectivamente con estas herramientas, mantener el pensamiento crítico y enfocarse en problemas de alto nivel mientras la IA maneja las tareas repetitivas y de bajo nivel.

---

*Este artículo fue escrito por hgaruna. Para más contenido sobre IA y desarrollo web, sigue nuestro blog.*
    `
  }
]

// Article storage utility
class ArticleStorage {
  constructor() {
    this.storageKey = 'hgaruna_articles'
    this.articles = []
    this.loading = true
    this.initializeArticles()
  }

  async initializeArticles() {
    try {
      // Check if we already have articles loaded
      const stored = localStorage.getItem(this.storageKey)
      const existingArticles = stored ? JSON.parse(stored) : []

      if (existingArticles.length > 10) {
        // We already have articles loaded, use them
        this.articles = existingArticles
        this.loading = false
        return
      }

      console.log('🔄 Loading existing articles from blog directory...')

      // Initialize with existing HTML articles
      const allArticles = await initializeArticles()

      // Add mock articles if we don't have enough variety
      if (allArticles.length < 3) {
        const mockWithUniqueIds = MOCK_ARTICLES.map(article => ({
          ...article,
          id: Date.now() + Math.random()
        }))
        allArticles.unshift(...mockWithUniqueIds)
      }

      this.articles = allArticles
      this.saveArticles(this.articles)
      this.loading = false

      console.log(`✅ Loaded ${this.articles.length} articles total`)

    } catch (error) {
      console.error('Error initializing articles:', error)
      this.articles = MOCK_ARTICLES
      this.loading = false
    }
  }

  loadArticles() {
    return this.articles
  }

  saveArticles(articles) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(articles))
      this.articles = articles
    } catch (error) {
      console.error('Error saving articles:', error)
    }
  }

  getAllArticles() {
    return this.articles
  }

  getArticleBySlug(slug) {
    return this.articles.find(article => article.slug === slug)
  }

  getArticlesByCategory(category) {
    return this.articles.filter(article => article.category === category)
  }

  getFeaturedArticles() {
    return this.articles.filter(article => article.featured)
  }

  getRecentArticles(limit = 5) {
    return this.articles
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
  }

  async addArticle(article) {
    const newArticle = {
      ...article,
      id: Date.now(),
      date: article.date || new Date().toISOString().split('T')[0],
      slug: article.slug || generateSlug(article.title)
    }

    // Save to file system
    try {
      await saveArticleToFile(newArticle, 'html')
      console.log(`Artículo guardado en archivo: ${newArticle.slug}.html`)
    } catch (error) {
      console.error('Error guardando artículo en archivo:', error)
    }

    this.articles.unshift(newArticle)
    this.saveArticles(this.articles)

    // Auto-update sitemap
    try {
      await autoUpdateSitemap(this.articles)
    } catch (error) {
      console.error('Error updating sitemap:', error)
    }

    return newArticle
  }

  updateArticle(id, updates) {
    const index = this.articles.findIndex(article => article.id === id)
    if (index !== -1) {
      this.articles[index] = { ...this.articles[index], ...updates }
      this.saveArticles(this.articles)

      // Auto-update sitemap
      autoUpdateSitemap(this.articles).catch(console.error)

      return this.articles[index]
    }
    return null
  }

  deleteArticle(id) {
    this.articles = this.articles.filter(article => article.id !== id)
    this.saveArticles(this.articles)

    // Auto-update sitemap
    autoUpdateSitemap(this.articles).catch(console.error)
  }

  searchArticles(query) {
    const searchTerm = query.toLowerCase()
    return this.articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }
}

// Create global instance
const articleStorage = new ArticleStorage()

export function useArticles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)

      // Wait for articleStorage to initialize
      const checkInitialization = () => {
        if (!articleStorage.loading) {
          setArticles(articleStorage.getAllArticles())
          setLoading(false)
        } else {
          setTimeout(checkInitialization, 100)
        }
      }

      checkInitialization()
    }

    initializeData()
  }, [])

  const refreshArticles = () => {
    setArticles(articleStorage.getAllArticles())
  }

  const getArticleBySlug = (slug) => {
    return articleStorage.getArticleBySlug(slug)
  }

  const getArticlesByCategory = (category) => {
    return articleStorage.getArticlesByCategory(category)
  }

  const getFeaturedArticles = () => {
    return articleStorage.getFeaturedArticles()
  }

  const getRecentArticles = (limit) => {
    return articleStorage.getRecentArticles(limit)
  }

  const addArticle = async (article) => {
    try {
      setLoading(true)
      const newArticle = await articleStorage.addArticle(article)
      refreshArticles()
      return newArticle
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateArticle = (id, updates) => {
    try {
      const updated = articleStorage.updateArticle(id, updates)
      refreshArticles()
      return updated
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteArticle = (id) => {
    try {
      articleStorage.deleteArticle(id)
      refreshArticles()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const searchArticles = (query) => {
    return articleStorage.searchArticles(query)
  }

  return {
    articles,
    loading,
    error,
    refreshArticles,
    getArticleBySlug,
    getArticlesByCategory,
    getFeaturedArticles,
    getRecentArticles,
    addArticle,
    updateArticle,
    deleteArticle,
    searchArticles
  }
}

export default useArticles
