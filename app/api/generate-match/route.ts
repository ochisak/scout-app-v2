import { NextRequest, NextResponse } from 'next/server'
import openai from '@/lib/openai'

export async function POST(req: NextRequest) {
  const { job, candidate } = await req.json()

  const prompt = `
以下の「求人情報」と「候補者情報」をもとに、プロの転職エージェントとしての視点でマッチ度評価のみを300～400文字で出力してください。

【出力形式】
- 必ず「マッチ度フィードバック：」という見出しから始めること
- 以下の構成を含むこと：
  - 求人側の要件
  - 候補者のスキルや経験
  - 合致点・懸念点
  - 総合的な所見（客観性と納得感重視）

【求人情報】
${job}

【候補者情報】
${candidate}
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'あなたはプロの転職エージェントです。' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  })

  const content = response.choices[0].message.content || ''
  const matchScoreMatch = content.match(/^マッチ度フィードバック[:：]?[ \t]*([\s\S]+)$/m)

  return NextResponse.json({
    matchScore: matchScoreMatch?.[1]?.trim() || content,
  })
}
