import React, { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContentRendererProps {
    contentKey: string
    languageData: any
}

interface CodeBlockProps {
    code: string
    language?: string
}

function CodeBlock({ code, language }: CodeBlockProps) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy code:', err)
        }
    }

    return (
        <div className="relative group w-full my-4 max-w-full">
            <div className="flex items-center justify-between bg-muted px-3 sm:px-4 py-2 rounded-t-md border-b">
                {language && (
                    <span className="text-xs font-medium text-muted-foreground uppercase truncate mr-2">
                        {language}
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-6 w-6 p-0 opacity-70 hover:opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0"
                >
                    {copied ? (
                        <Check className="h-3 w-3 text-green-500" />
                    ) : (
                        <Copy className="h-3 w-3" />
                    )}
                </Button>
            </div>
            <pre className="bg-muted p-3 sm:p-4 rounded-b-md overflow-x-auto w-full max-w-full scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                <code className={cn(
                    "text-xs sm:text-sm block w-full max-w-full whitespace-pre-wrap break-words sm:whitespace-pre",
                    language && `language-${language}`
                )}>
                    {code}
                </code>
            </pre>
        </div>
    )
}

export function ContentRenderer({ contentKey, languageData }: ContentRendererProps) {
    let content = null;
        if (languageData?.content) {
            for (const headingKey of Object.keys(languageData.content)) {
                const heading = languageData.content[headingKey];
                if (heading && typeof heading === 'object' && 'pages' in heading) {
                    const pages = heading.pages as Record<string, any>;
                    if (pages && contentKey in pages) {
                        content = pages[contentKey];
                        break;
                    }
                }
            }
    }

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [contentKey])

    if (!content) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
        )
    }

    const renderContent = (text: string) => {
        const lines = text.split('\n')
        const elements: React.ReactNode[] = []
        let currentCodeBlock: string[] = []
        let codeLanguage = ''
        let inCodeBlock = false
        let currentTable: string[][] = []
        let inTable = false

        const formatText = (text: string) => {
            let result = text

            result = result.replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>')
            result = result.replace(/__(.*?)__/g, '<u class="underline">$1</u>')
            result = result.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
            result = result.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
            result = result.replace(/`([^`]+)`/g, (_, code) => {
                const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;')
                return `<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono break-words max-w-full inline-block">${escapedCode}</code>`
            })
            
            const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
            result = result.replace(imageRegex, (_, alt, src) => {
                const imageSrc = src.startsWith('https') ? src : `/${src.replace(/^\/+/, '')}`
                return `<img src="${imageSrc}" alt="${alt}" draggable="false" class="max-w-2xl w-full h-auto rounded-lg shadow-sm my-4 mx-auto block" loading="lazy" />`
            })
            
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
            result = result.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline underline-offset-4 decoration-2 hover:decoration-primary/80 transition-colors duration-200 font-medium break-words">$1</a>')

            return result
        }

        lines.forEach((line, index) => {
            if (line.startsWith('```')) {
                if (inCodeBlock) {
                    elements.push(
                        <CodeBlock 
                            key={`code-${index}`} 
                            code={currentCodeBlock.join('\n')} 
                            language={codeLanguage}
                        />
                    )
                    currentCodeBlock = []
                    codeLanguage = ''
                    inCodeBlock = false
                } else {
                    inCodeBlock = true
                    codeLanguage = line.replace('```', '').trim()
                }
                return
            }

            if (inCodeBlock) {
                currentCodeBlock.push(line)
                return
            }

            if (line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|')) {
                if (!inTable) {
                    inTable = true
                    currentTable = []
                }
                const cells = line.split('|').slice(1, -1).map(cell => cell.trim())
                currentTable.push(cells)
                return
            } else if (inTable) {
                elements.push(
                    <div key={`table-${index}`} className="my-6 overflow-x-auto w-full max-w-full scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow>
                                    {currentTable[0]?.map((cell, i) => (
                                        <TableHead key={i} className="font-semibold whitespace-nowrap px-2 sm:px-4">
                                            <span dangerouslySetInnerHTML={{ __html: formatText(cell) }} />
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentTable.slice(1).map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <TableCell key={cellIndex} className="px-2 sm:px-4 break-words max-w-xs">
                                                <span dangerouslySetInnerHTML={{ __html: formatText(cell) }} />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )
                currentTable = []
                inTable = false
            }

            if (line.startsWith('#### ')) {
                elements.push(
                    <h4 key={index} className="text-lg font-semibold tracking-tight mt-6 mb-2">
                        <span dangerouslySetInnerHTML={{ __html: formatText(line.replace('#### ', '')) }} />
                    </h4>
                )
            } else if (line.startsWith('### ')) {
                elements.push(
                    <h3 key={index} className="text-xl font-semibold tracking-tight mt-6 mb-3">
                        <span dangerouslySetInnerHTML={{ __html: formatText(line.replace('### ', '')) }} />
                    </h3>
                )
            } else if (line.startsWith('## ')) {
                elements.push(
                    <h2 key={index} className="text-2xl font-bold tracking-tight mt-8 mb-4">
                        <span dangerouslySetInnerHTML={{ __html: formatText(line.replace('## ', '')) }} />
                    </h2>
                )
            } else if (line.startsWith('# ')) {
                elements.push(
                    <h1 key={index} className="text-3xl font-bold tracking-tight mt-8 mb-6">
                        <span dangerouslySetInnerHTML={{ __html: formatText(line.replace('# ', '')) }} />
                    </h1>
                )
            } else if (line.startsWith('> ')) {
                elements.push(
                    <blockquote key={index} className="border-l-4 border-muted-foreground/25 pl-4 italic text-muted-foreground mb-4">
                        <span dangerouslySetInnerHTML={{ __html: formatText(line.replace('> ', '')) }} />
                    </blockquote>
                )
            } else if (line.startsWith(':::')) {
                const alertMatch = line.match(/^:::(info|warning|danger|success)\s*(.*)$/)
                if (alertMatch) {
                    const alertType = alertMatch[1]
                    const alertMessage = alertMatch[2] || alertType
                    const alertClasses = {
                        'info': 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/50 p-4 mb-4 rounded-r',
                        'warning': 'border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/50 p-4 mb-4 rounded-r',
                        'danger': 'border-l-4 border-red-500 bg-red-50 dark:bg-red-950/50 p-4 mb-4 rounded-r',
                        'success': 'border-l-4 border-green-500 bg-green-50 dark:bg-green-950/50 p-4 mb-4 rounded-r'
                    }
                    const textClasses = {
                        'info': 'text-blue-900 dark:text-blue-100',
                        'warning': 'text-yellow-900 dark:text-yellow-100',
                        'danger': 'text-red-900 dark:text-red-100',
                        'success': 'text-green-900 dark:text-green-100'
                    }
                    elements.push(
                        <div key={index} className={alertClasses[alertType as keyof typeof alertClasses] || alertClasses.info}>
                            <div className={cn("font-medium mb-1", textClasses[alertType as keyof typeof textClasses] || textClasses.info)}>
                                <span dangerouslySetInnerHTML={{ __html: formatText(alertMessage) }} />
                            </div>
                        </div>
                    )
                }
            } else if (line.trim() === '---') {
                elements.push(
                    <hr key={index} className="my-6 border-muted-foreground/25" />
                )
            } else if (line.match(/^\d+\./)) {
                elements.push(
                    <div key={index} className="ml-4 mb-2">
                        <span className="font-medium" dangerouslySetInnerHTML={{ __html: formatText(line) }} />
                    </div>
                )
            } else if (line.startsWith('- [x]') || line.startsWith('- [ ]')) {
                const isChecked = line.startsWith('- [x]')
                const text = line.replace(/- \[[x ]\] /, '')
                elements.push(
                    <div key={index} className="ml-4 mb-2 flex items-start">
                        <input 
                            type="checkbox" 
                            checked={isChecked} 
                            readOnly 
                            className="mr-2 mt-1 flex-shrink-0"
                        />
                        <span 
                            className={isChecked ? 'line-through text-muted-foreground' : ''}
                            dangerouslySetInnerHTML={{ __html: formatText(text) }}
                        />
                    </div>
                )
            } else if (line.startsWith('- ')) {
                elements.push(
                    <div key={index} className="ml-4 mb-2 flex items-start">
                        <span className="mr-2 text-primary flex-shrink-0">•</span>
                        <span dangerouslySetInnerHTML={{ __html: formatText(line.replace('- ', '')) }} />
                    </div>
                )
            } else if (line.trim() !== '') {
                elements.push(
                    <p key={index} className="mb-4 leading-7">
                        <span dangerouslySetInnerHTML={{ __html: formatText(line) }} />
                    </p>
                )
            } else {
                elements.push(<div key={index} className="mb-2" />)
            }
        })

        if (inTable && currentTable.length > 0) {
            elements.push(
                <div key="final-table" className="my-6 overflow-x-auto w-full max-w-full scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                    <Table className="min-w-full">
                        <TableHeader>
                            <TableRow>
                                {currentTable[0]?.map((cell, i) => (
                                    <TableHead key={i} className="font-semibold whitespace-nowrap px-2 sm:px-4">
                                        <span dangerouslySetInnerHTML={{ __html: formatText(cell) }} />
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentTable.slice(1).map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <TableCell key={cellIndex} className="px-2 sm:px-4 break-words max-w-xs">
                                            <span dangerouslySetInnerHTML={{ __html: formatText(cell) }} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )
        }

        return elements
    }

    return (
        <div className="flex flex-col space-y-6 w-full max-w-full overflow-hidden">
            <div className="flex flex-col space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight break-words">
                    {content.title}
                </h1>
                <div className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed break-words">
                    {content.description}
                </div>
            </div>
            
            <div className="prose prose-gray dark:prose-invert max-w-none w-full overflow-hidden">
                {renderContent(content.content)}
            </div>
        </div>
    )
}
