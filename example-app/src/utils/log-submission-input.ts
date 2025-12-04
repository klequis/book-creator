export function logSubmissionInput(input: any, label = 'Submission Input Array') {
  const log = console.log
  
  console.group(`=== ${label} Analysis ===`)
  
  // Build a comprehensive report for the input array
  const report = {
    timestamp: new Date().toISOString(),
    inputAnalysis: {
      type: typeof input,
      isArray: Array.isArray(input),
      length: input?.length,
      constructor: input?.constructor?.name,
      arrayMethods: [] as string[],
      elements: [] as any[]
    }
  }
  
  // Basic input analysis
  log('=== INPUT OVERVIEW ===')
  log('input:', input)
  log('typeof input:', typeof input)
  log('Array.isArray(input):', Array.isArray(input))
  log('input.length:', input?.length)
  log('input.constructor:', input?.constructor)
  log('input.constructor.name:', input?.constructor?.name)
  
  if (input && Array.isArray(input)) {
    // Get array methods
    const arrayPrototype = Object.getPrototypeOf(input)
    const arrayMethods = Object.getOwnPropertyNames(arrayPrototype).filter(prop => 
      typeof (input as any)[prop] === 'function'
    )
    report.inputAnalysis.arrayMethods = arrayMethods
    log('Available array methods:', arrayMethods)
    
    // Analyze each element in the array
    log('=== ARRAY ELEMENTS ANALYSIS ===')
    input.forEach((element: any, index: number) => {
      const elementAnalysis = {
        index,
        type: typeof element,
        constructor: element?.constructor?.name,
        isFormData: element instanceof FormData,
        isURLSearchParams: element instanceof URLSearchParams,
        properties: {} as any,
        methods: [] as string[],
        entries: [] as Array<[string, any]>,
        keys: [] as string[],
        values: [] as any[]
      }
      
      log(`\n--- Element ${index} ---`)
      log(`Type: ${typeof element}`)
      log(`Constructor: ${element?.constructor?.name}`)
      log(`Element:`, element)
      
      // Check if it's FormData
      if (element instanceof FormData) {
        log('✅ This is FormData')
        elementAnalysis.isFormData = true
        
        // Get all FormData entries
        try {
          const entries = Array.from(element.entries())
          elementAnalysis.entries = entries
          log('FormData entries:', entries)
          
          // Get keys and values separately
          const keys = Array.from(element.keys())
          const values = Array.from(element.values())
          elementAnalysis.keys = keys
          elementAnalysis.values = values
          log('FormData keys:', keys)
          log('FormData values:', values)
          
          // Try to access each key individually
          keys.forEach(key => {
            const value = element.get(key)
            const allValues = element.getAll(key)
            log(`  ${key}: "${value}" (get)`)
            log(`  ${key}: [${allValues.join(', ')}] (getAll)`)
          })
          
        } catch (e) {
          log('Error reading FormData:', e)
        }
      }
      
      // Check if it's URLSearchParams
      if (element instanceof URLSearchParams) {
        log('✅ This is URLSearchParams')
        elementAnalysis.isURLSearchParams = true
        
        try {
          const entries = Array.from(element.entries())
          elementAnalysis.entries = entries
          log('URLSearchParams entries:', entries)
          
          const keys = Array.from(element.keys())
          const values = Array.from(element.values())
          elementAnalysis.keys = keys
          elementAnalysis.values = values
          log('URLSearchParams keys:', keys)
          log('URLSearchParams values:', values)
          
        } catch (e) {
          log('Error reading URLSearchParams:', e)
        }
      }
      
      // General object analysis
      if (element && typeof element === 'object') {
        // Get own properties
        const ownProps = Object.getOwnPropertyNames(element)
        log('Own properties:', ownProps)
        
        // Get enumerable properties
        const enumerableProps = Object.keys(element)
        log('Enumerable properties:', enumerableProps)
        
        // Get methods
        const methods = ownProps.filter(prop => {
          try {
            return typeof element[prop] === 'function'
          } catch {
            return false
          }
        })
        elementAnalysis.methods = methods
        log('Methods:', methods)
        
        // Get prototype
        const prototype = Object.getPrototypeOf(element)
        log('Prototype:', prototype)
        log('Prototype constructor:', prototype?.constructor?.name)
        
        // Try for...in loop
        const allProps = []
        try {
          for (const prop in element) {
            allProps.push(prop)
          }
          log('for...in properties:', allProps)
        } catch (e) {
          log('Error in for...in loop:', e)
        }
        
        // Try to access some common properties
        const commonProps = ['length', 'size', 'name', 'value', 'type']
        commonProps.forEach(prop => {
          try {
            if (prop in element) {
              const value = element[prop]
              elementAnalysis.properties[prop] = value
              log(`  ${prop}: ${value}`)
            }
          } catch (e) {
            log(`Error accessing ${prop}:`, e)
          }
        })
      }
      
      report.inputAnalysis.elements.push(elementAnalysis)
    })
  } else {
    log('Input is not an array or is null/undefined')
  }
  
  // Log the structured report
  log('\n=== STRUCTURED REPORT (Copy this) ===')
  console.log(JSON.stringify(report, null, 2))
  
  // Create formatted text report
  const textReport = `
=== ${label.toUpperCase()} ANALYSIS REPORT ===
Generated: ${report.timestamp}

INPUT OVERVIEW:
  Type: ${report.inputAnalysis.type}
  Is Array: ${report.inputAnalysis.isArray}
  Length: ${report.inputAnalysis.length}
  Constructor: ${report.inputAnalysis.constructor}
  Array Methods: ${JSON.stringify(report.inputAnalysis.arrayMethods)}

ELEMENTS ANALYSIS:
${report.inputAnalysis.elements.map((el, i) => `
  Element ${i}:
    Type: ${el.type}
    Constructor: ${el.constructor}
    Is FormData: ${el.isFormData}
    Is URLSearchParams: ${el.isURLSearchParams}
    Keys: ${JSON.stringify(el.keys)}
    Values: ${JSON.stringify(el.values)}
    Entries: ${JSON.stringify(el.entries)}
    Methods: ${JSON.stringify(el.methods)}
    Properties: ${JSON.stringify(el.properties)}
`).join('\n')}

=== END REPORT ===
`
  
  log('\n=== FORMATTED TEXT REPORT (Copy this) ===')
  console.log(textReport)
  
  // Try to download as file
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
    log('✅ Downloaded input analysis JSON file')
  } catch (e) {
    log('❌ Could not auto-download file:', e)
  }
  
  console.groupEnd()
  
  return report
}