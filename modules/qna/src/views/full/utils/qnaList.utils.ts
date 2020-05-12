import { lang } from 'botpress/shared'
import _ from 'lodash'
import _uniqueId from 'lodash/uniqueId'

import { QnaItem } from '../../../backend/qna'

export const ITEMS_PER_PAGE = 20

export interface State {
  count: number
  items: any[]
  loading: boolean
  page: number
  fetchMore: boolean
  expandedItems: { [key: string]: boolean }
}

export interface Props {
  bp: any
  topicName: string
  contentLang: string
  defaultLanguage: string
  languages: string[]
}

export interface FormErrors {
  answers: { [key: string]: string }
  questions: { [key: string]: string }
}

export const hasPopulatedLang = (data: { [lang: string]: string[] }): boolean => {
  return !!Object.values(data)
    .reduce((acc, arr) => [...acc, ...arr], [])
    .filter(entry => !!entry.trim().length).length
}

export const itemHasError = (qnaItem: QnaItem, currentLang: string): string[] => {
  const errors = []
  const { data } = qnaItem

  const hasDupplicateQuestions = data.questions[currentLang].filter((item, index) =>
    [...data.questions[currentLang].slice(0, index).filter(item2 => item2.length)].includes(item)
  )

  if (!hasPopulatedLang(data.questions)) {
    errors.push(lang.tr('module.qna.form.missingQuestion'))
  }
  if (!hasPopulatedLang(data.answers)) {
    errors.push(lang.tr('module.qna.form.missingAnswer'))
  }
  if (hasDupplicateQuestions.length) {
    errors.push(lang.tr('module.qna.form.writingSameQuestion'))
  }

  return errors
}

export const dispatchMiddleware = async (dispatch, action) => {
  const { qnaItem, bp } = action.data
  switch (action.type) {
    case 'updateQnA':
      const { currentLang } = action.data
      let itemId = qnaItem.id
      let saveError = null

      if (!itemHasError(qnaItem, currentLang).length) {
        const { answers, questions } = qnaItem.data
        const cleanData = {
          ...qnaItem.data,
          answers: {
            ...Object.keys(answers).reduce(
              (acc, lang) => ({ ...acc, [lang]: [...answers[lang].filter(entry => !!entry.trim().length)] }),
              {}
            )
          },
          questions: {
            ...Object.keys(questions).reduce(
              (acc, lang) => ({ ...acc, [lang]: [...questions[lang].filter(entry => !!entry.trim().length)] }),
              {}
            )
          }
        }
        if (qnaItem.id.startsWith('qna-')) {
          try {
            const res = await bp.axios.post('/mod/qna/questions', cleanData)
            itemId = res.data[0]
          } catch ({ response: { data } }) {
            saveError = data.message
          }
        } else {
          try {
            await bp.axios.post(`/mod/qna/questions/${qnaItem.id}`, cleanData)
          } catch ({ response: { data } }) {
            saveError = data.message
          }
        }
      }

      dispatch({ ...action, data: { ...action.data, qnaItem: { ...qnaItem, id: itemId, saveError } } })
      break

    case 'toggleEnabledQnA':
      const originalValue = qnaItem.data.enabled

      qnaItem.data.enabled = !originalValue

      if (!qnaItem.id.startsWith('qna-')) {
        try {
          await bp.axios.post(`/mod/qna/questions/${qnaItem.id}`, qnaItem.data)
        } catch {
          qnaItem.data.enabled = originalValue
        }
      }

      dispatch(action)
      break

    default:
      return dispatch(action)
  }
}

export const fetchReducer = (state: State, action): State => {
  if (action.type === 'dataSuccess') {
    const { items, count, page } = action.data

    return {
      ...state,
      count,
      items: [...state.items, ...items],
      loading: false,
      page,
      fetchMore: false
    }
  } else if (action.type === 'resetData') {
    return {
      ...state,
      count: 0,
      items: [],
      page: 1,
      fetchMore: false,
      expandedItems: {}
    }
  } else if (action.type === 'loading') {
    return {
      ...state,
      loading: true
    }
  } else if (action.type === 'updateQnA') {
    const { qnaItem, index } = action.data
    const newItems = state.items

    newItems[index] = { ...newItems[index], saveError: qnaItem.saveError, id: qnaItem.id, data: qnaItem.data }

    return {
      ...state,
      items: newItems
    }
  } else if (action.type === 'addQnA') {
    const newItems = state.items
    const id = _uniqueId('qna-')
    const { languages, contexts } = action.data
    const languageArrays = languages.reduce((acc, lang) => ({ ...acc, [lang]: [''] }), {})

    newItems.unshift({
      id,
      isNew: true,
      data: {
        action: 'text',
        contexts,
        enabled: true,
        answers: _.cloneDeep(languageArrays),
        questions: _.cloneDeep(languageArrays),
        redirectFlow: '',
        redirectNode: ''
      }
    })

    return {
      ...state,
      items: newItems,
      expandedItems: {...state.expandedItems, [id]: true}
    }
  } else if (action.type === 'deleteQnA') {
    const { index, bp } = action.data
    const newItems = state.items

    const [deletedItem] = newItems.splice(index, 1)

    if (!deletedItem.id.startsWith('qna-')) {
      bp.axios
        .post(`/mod/qna/questions/${deletedItem.id}/delete`)
        .then(() => {})
        .catch(() => {})
    }

    return {
      ...state,
      items: newItems
    }
  } else if (action.type === 'toggleExpandOne') {
    const { expandedItems } = state

    return {
      ...state,
      expandedItems: { ...expandedItems, ...action.data }
    }
  } else if (action.type === 'expandAll') {
    const { items } = state

    return {
      ...state,
      expandedItems: items.reduce((acc, item) => ({ ...acc, [item.id]: true }), {})
    }
  } else if (action.type === 'collapseAll') {
    return {
      ...state,
      expandedItems: {}
    }
  } else if (action.type === 'disableQnA') {
    const { index } = action.data
    const newItems = state.items

    newItems[index].enabled = false

    return {
      ...state,
      items: newItems
    }
  } else if (action.type === 'fetchMore') {
    return {
      ...state,
      fetchMore: true
    }
  } else if (action.type === 'toggleEnabledQnA') {
    return {
      ...state,
      items: state.items
    }
  } else {
    throw new Error(`That action type isn't supported.`)
  }
}
