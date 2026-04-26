import { parsePromptContent } from '../lib/parameters'

type PromptContentPreviewProps = {
  content: string
}

export function PromptContentPreview({ content }: PromptContentPreviewProps) {
  const segments = parsePromptContent(content)

  if (!content.trim()) {
    return <p className="text-sm text-slate-500">No content yet.</p>
  }

  return (
    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return <span key={`text-${index}`}>{segment.value}</span>
        }

        return (
          <span
            key={`param-${index}`}
            title={segment.explanation}
            className="mx-0.5 inline-flex cursor-help items-center gap-1 rounded-lg border border-[#F5C8BD] bg-[#F5C8BD]/40 px-1.5 py-0.5 font-medium text-[#965a67]"
          >
            <span>{`{{${segment.key || 'param'}}}`}</span>
            {segment.defaultValue ? (
              <span className="rounded-md bg-white/70 px-1 text-[10px] font-semibold text-[#7a4d59]">
                default: {segment.defaultValue}
              </span>
            ) : null}
          </span>
        )
      })}
    </p>
  )
}
