import React from 'react'
import generatePDF from 'react-to-pdf'

export default function ReactToPdf({ children, filename = 'download.pdf', targetRef, options }) {
  const fallbackRef = React.useRef(null)
  const sourceRef = targetRef || fallbackRef

  const toPdf = React.useCallback(() => {
    return generatePDF(sourceRef, {
      filename,
      method: 'save',
      ...options,
    })
  }, [filename, options, sourceRef])

  return children({ toPdf, targetRef: sourceRef })
}
