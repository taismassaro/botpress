import _ from 'lodash'

import { computeNorm, scalarDivide, vectorAdd, zeroes } from '../tools/math'
import Utterance, { UtteranceToken } from '../utterance/utterance'

function getEntitiesEncoding(utt: Utterance, customEntities: string[]): number[] {
  const entityMap: _.Dictionary<number> = customEntities.reduce((map, next) => ({ ...map, [next]: 0 }), {})
  utt.entities.forEach(e => entityMap[e.type]++)
  return _.chain(entityMap)
    .toPairs()
    .orderBy('0')
    .map(([key, val]) => val)
    .value()
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

export function featurizeUtteranceForIntent(utt: Utterance, customEntities: string[]): number[] {
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
  const entitiesOH = getEntitiesEncoding(utt, customEntities)

  return [...sentenceEmbedding, ...entitiesOH, utt.tokens.length]
}
