export function logSubmissionProxy(sub: any, label = 'Submission Proxy') {
  const log = console.log
  
  console.group(`=== ${label} Analysis ===`)
  
  // Build a comprehensive report
  const report = {
    timestamp: new Date().toISOString(),
    analysis: {
      directProperties: {
        input: sub.input,
        result: sub.result,
        error: sub.error,
        pending: sub.pending,
        url: sub.url,
        clear: sub.clear,
        retry: sub.retry
      },
      objectIntrospection: {
        ownPropertyNames: Object.getOwnPropertyNames(sub),
        ownPropertyDescriptors: Object.getOwnPropertyDescriptors(sub),
        keys: Object.keys(sub),
        reflectOwnKeys: Reflect.ownKeys(sub)
      },
      prototype: {
        prototype: Object.getPrototypeOf(sub),
        prototypePropertyNames: null as any
      },
      constructor: {
        constructor: sub.constructor,
        constructorName: sub.constructor?.name
      },
      enumerableProperties: [] as string[],
      categorizedProperties: {
        methods: [] as Array<{name: string, type: string}>,
        properties: [] as Array<{name: string, type: string, value: any}>
      }
    }
  }
  
  // Get prototype properties safely
  const prototype = Object.getPrototypeOf(sub)
  report.analysis.prototype.prototypePropertyNames = prototype ? Object.getOwnPropertyNames(prototype) : 'No prototype'
  
  // Try for...in loop to get all enumerable properties (including inherited)
  for (const prop in sub) {
    report.analysis.enumerableProperties.push(prop)
  }
  
  // Check known properties and categorize them
  const knownProps = ['input', 'result', 'error', 'pending', 'url', 'clear', 'retry'] as const
  knownProps.forEach(prop => {
    try {
      const value = (sub as any)[prop]
      if (typeof value === 'function') {
        report.analysis.categorizedProperties.methods.push({ 
          name: prop, 
          type: 'function'
        })
      } else {
        report.analysis.categorizedProperties.properties.push({ 
          name: prop, 
          type: typeof value, 
          value: value
        })
      }
    } catch (e) {
      log(`Error accessing ${prop}:`, e)
    }
  })
  
  // Log the structured report
  log('=== STRUCTURED REPORT (Copy this) ===')
  console.log(JSON.stringify(report, null, 2))
  
  // Also create a formatted text version
  const textReport = `
=== ${label.toUpperCase()} ANALYSIS REPORT ===
Generated: ${report.timestamp}

DIRECT PROPERTIES:
${Object.entries(report.analysis.directProperties).map(([key, value]) => 
  `  ${key}: ${typeof value === 'function' ? '[Function]' : JSON.stringify(value)}`
).join('\n')}

OBJECT INTROSPECTION:
  Own Property Names: ${JSON.stringify(report.analysis.objectIntrospection.ownPropertyNames)}
  Keys: ${JSON.stringify(report.analysis.objectIntrospection.keys)}
  Reflect Own Keys: ${JSON.stringify(report.analysis.objectIntrospection.reflectOwnKeys)}

PROTOTYPE CHAIN:
  Prototype: ${report.analysis.prototype.prototype ? '[Object]' : 'null'}
  Prototype Property Names: ${JSON.stringify(report.analysis.prototype.prototypePropertyNames)}

CONSTRUCTOR:
  Constructor: ${report.analysis.constructor.constructor ? '[Constructor]' : 'undefined'}
  Constructor Name: ${report.analysis.constructor.constructorName || 'undefined'}

ENUMERABLE PROPERTIES (for...in):
  ${JSON.stringify(report.analysis.enumerableProperties)}

CATEGORIZED PROPERTIES:
  Methods: ${JSON.stringify(report.analysis.categorizedProperties.methods, null, 2)}
  Properties: ${JSON.stringify(report.analysis.categorizedProperties.properties, null, 2)}

=== END REPORT ===
`
  
  log('=== FORMATTED TEXT REPORT (Copy this) ===')
  console.log(textReport)
  
  // Try to download as file (if running in browser)
  try {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${label.toLowerCase().replace(/\s+/g, '-')}-analysis-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    log('✅ Downloaded JSON report file')
  } catch (e) {
    log('❌ Could not auto-download file:', e)
  }
  
  console.groupEnd()
  
  return report
}