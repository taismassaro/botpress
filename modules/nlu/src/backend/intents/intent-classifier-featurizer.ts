import _ from 'lodash'

import { computeNorm, scalarDivide, vectorAdd, zeroes } from '../tools/math'
import Utterance, { UtteranceToken } from '../utterance/utterance'

function buildSlotOH(utt: Utterance): number[] {
  return []
}

function getSlotConfidence(token: UtteranceToken): number {
  return (
    _.chain(token.slots)
      .orderBy('confidence', 'desc')
      .map('confidence')
      .first()
      .value() || 0
  )
}

function getTokenWeight(token: UtteranceToken): number {
  const tfidfFactor = Math.min(1, token.tfidf)
  const slotFactor = 1 - getSlotConfidence(token)

  return tfidfFactor * slotFactor
}

export function featurizeUtteranceForIntent(utt: Utterance): number[] {
  const nullVec = zeroes(utt.tokens[0].vector.length)

  const toks = utt.tokens.filter(t => t.isWord)
  if (_.isEmpty(toks)) {
    nullVec
  }

  const totalWeight = toks.reduce((sum, t) => sum + getTokenWeight(t), 0)
  const weightedSum = toks.reduce((sum, t) => {
    const norm = computeNorm(<number[]>t.vector)
    const weightedVec = scalarDivide(<number[]>t.vector, norm / getTokenWeight(t))
    return vectorAdd(sum, weightedVec)
  }, nullVec)

  const sentenceEmbedding = scalarDivide(weightedSum, totalWeight)
  const slotOH = buildSlotOH(utt)

  return [...sentenceEmbedding, ...slotOH, utt.tokens.length]
}
