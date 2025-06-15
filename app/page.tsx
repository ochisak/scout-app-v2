'use client'

import React, { useState } from 'react'
import Section from '../components/Section'

export default function Home() {
  const [job, setJob] = useState('')
  const [candidate, setCandidate] = useState('')
  const [templateType, setTemplateType] = useState('oneness')
  const [result, setResult] = useState('')
  const [matchScore, setMatchScore] = useState('')
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(false)
  const [matchLoading, setMatchLoading] = useState(false)

  const handleSubmit = async () => {
    if (!job || !candidate) {
      alert('求人情報と候補者情報を両方入力してください。')
      return
    }

    setLoading(true)
    setResult('')
    setMatchScore('')
    setSubject('')

    try {
      const scoutRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, candidate, templateType }),
      })
      const scoutData = await scoutRes.json()
      setResult(scoutData.result)
      setSubject(scoutData.subject)

      setMatchLoading(true)
      const matchRes = await fetch('/api/generate-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, candidate }),
      })
      const matchData = await matchRes.json()
      setMatchScore(matchData.matchScore)
    } catch {
      setResult('エラーが発生しました。')
      setMatchScore('')
    } finally {
      setLoading(false)
      setMatchLoading(false)
    }
  }

  return (
    <main className="max-w-3xl mx-auto py-10 px-4 space-y-6 text-slate-800">
      <h1 className="text-3xl font-bold text-white">スカウト文自動生成</h1>


      <Section>
        <label className="block font-semibold mb-1 text-slate-800">テンプレート選択</label>
        <select
          className="w-full border border-slate-300 p-2 rounded bg-white text-slate-800"
          value={templateType}
          onChange={(e) => setTemplateType(e.target.value)}
        >
          <option value="oneness">ONENESS用（標準）</option>
          <option value="casual">カジュアル</option>
          <option value="cxo">CxO・ハイクラス向け</option>
          <option value="startup">スタートアップ向け</option>
          <option value="global">グローバル向け</option>
        </select>
      </Section>

      <Section>
        <label className="block font-semibold mb-1 text-slate-800">求人情報</label>
        <textarea
          className="w-full border border-slate-300 p-2 rounded placeholder:text-slate-600 text-slate-800"
          rows={6}
          value={job}
          onChange={(e) => setJob(e.target.value)}
          placeholder="ここに求人票や会社情報を貼り付けてください"
        />
      </Section>

      <Section>
        <label className="block font-semibold mb-1 text-slate-800">候補者情報</label>
        <textarea
          className="w-full border border-slate-300 p-2 rounded placeholder:text-slate-600 text-slate-800"
          rows={6}
          value={candidate}
          onChange={(e) => setCandidate(e.target.value)}
          placeholder="ここに候補者の職務経歴などを貼り付けてください"
        />
      </Section>

      <Section className="flex justify-end">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '生成中...' : '生成する'}
        </button>
      </Section>

      {loading && (
        <div className="mt-4 flex items-center space-x-2 text-blue-600">
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span>生成中です。しばらくお待ちください...</span>
        </div>
      )}

      {(subject || result || matchScore) && (
        <Section className="space-y-6">
          <div className="bg-green-50 border border-green-300 text-green-800 p-4 rounded">
            <p className="font-semibold">✅ スカウト文が完成しました！</p>
            <p className="mt-1 text-sm">
              下記より内容をご確認の上、必要に応じてコピーしてご利用ください。マッチ度フィードバックも参考にご覧ください。
            </p>
          </div>

          {subject && (
            <div>
              <h2 className="text-lg font-semibold text-blue-600">件名：</h2>
              <p className="text-slate-800">{subject}</p>
            </div>
          )}

          {result && (
            <div className="bg-white border rounded shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-2">スカウト文：</h2>
              <p className="whitespace-pre-wrap text-slate-800">{result}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result)
                  alert('スカウト文をコピーしました！')
                }}
                className="mt-4 bg-gray-300 text-slate-800 px-3 py-1 rounded hover:bg-gray-400 transition"
              >
                コピーする
              </button>
            </div>
          )}

          {matchLoading ? (
            <div className="flex items-center space-x-2 text-blue-500 text-sm">
              <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span>マッチ度フィードバックを生成中です...</span>
            </div>
          ) : matchScore && (
            <div className="bg-gray-100 border-l-4 border-blue-400 p-4 text-sm text-slate-800">
              <h2 className="text-md font-semibold text-blue-700 mb-2">マッチ度フィードバック：</h2>
              <p className="whitespace-pre-wrap">{matchScore}</p>
            </div>
          )}
        </Section>
      )}
    </main>
  )
}
