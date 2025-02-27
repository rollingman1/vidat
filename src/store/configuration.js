import deepClone from 'lodash.clonedeep'
import { defineStore } from 'pinia'
import { reactive, toRefs, watch } from 'vue'
import { validateActionLabelData, validateObjectLabelData, validateSkeletonTypeData } from './validation.js'

const OBJECT_LABEL_LS_KEY = 'objectLabelData'
const ACTION_LABEL_LS_KEY = 'actionLabelData'
const SKELETON_LABEL_LS_KEY = 'skeletonTypeData'

const DEFAULT_CONFIGURATION = {
  objectLabelData: [
    {
      'id': 0,
      'name': 'default',
      'color': '#00FF00'
    },
    {
      'id': 1,
      'name': 'leg',
      'color': '#FF0000'
    },
    {
      'id': 2,
      'name': 'table top',
      'color': '#0000FF'
    },
    {
      'id': 3,
      'name': 'table',
      'color': '#FF00FF'
    },
    {
      'id': 4,
      'name': 'shelf',
      'color': '#00FF00'
    },
    {
      'id': 5,
      'name': 'side panel',
      'color': '#118822'
    },
    {
      'id': 6,
      'name': 'top panel',
      'color': '#776688'
    },
    {
      'id': 7,
      'name': 'front panel',
      'color': '#6600EE'
    },
    {
      'id': 8,
      'name': 'back panel',
      'color': '#AAAA33'
    },
    {
      'id': 9,
      'name': 'bottom panel',
      'color': '#552277'
    },
    {
      'id': 10,
      'name': 'pin',
      'color': '#CC66FF'
    }
  ],
  actionLabelData: [
    {
      'id': 0,
      'name': 'default',
      'color': '#0000FF',
      'objects': [0]
    },
    {
      'id': 1,
      'name': 'pick up',
      'color': '#00FFFF',
      'objects': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    {
      'id': 2,
      'name': 'lay down',
      'color': '#FF00FF',
      'objects': [0]
    },
    {
      'id': 3,
      'name': 'push',
      'color': '#85ad85',
      'objects': [0]
    },
    {
      'id': 4,
      'name': 'align leg screw with table thread',
      'color': '#adad91',
      'objects': [0]
    },
    {
      'id': 5,
      'name': 'spin leg',
      'color': '#CC55FF',
      'objects': [0]
    },
    {
      'id': 6,
      'name': 'tighten leg',
      'color': '#AABB22',
      'objects': [0]
    },
    {
      'id': 7,
      'name': 'rotate table',
      'color': '#FF2255',
      'objects': [0]
    },
    {
      'id': 8,
      'name': 'flip',
      'color': '#7755FF',
      'objects': [0]
    },
    {
      'id': 9,
      'name': 'attach shelf to table',
      'color': '#BB55BB',
      'objects': [0]
    },
    {
      'id': 10,
      'name': 'align side panel holes with front panel dowels',
      'color': '#EEBB33',
      'objects': [0]
    },
    {
      'id': 11,
      'name': 'attach drawer side panel',
      'color': '#DD5566',
      'objects': [0]
    },
    {
      'id': 12,
      'name': 'attach drawer back panel',
      'color': '#551144',
      'objects': [0]
    },
    {
      'id': 13,
      'name': 'slide bottom of drawer',
      'color': '#2299EE',
      'objects': [0]
    },
    {
      'id': 14,
      'name': 'insert drawer pin',
      'color': '#252545',
      'objects': [0]
    },
    {
      'id': 15,
      'name': 'position the drawer right side up',
      'color': '#99AA66',
      'objects': [0]
    },
    {
      'id': 16,
      'name': 'other',
      'color': '#77CCCC',
      'objects': [0]
    }
  ],
  skeletonTypeData: [
    {
      id: 0,
      name: 'human',
      description: 'open pose',
      color: '#00FF00',
      pointList: [
        {
          id: 0,
          name: 'nose',
          x: 0,
          y: -30
        },
        {
          id: 1,
          name: 'left eye',
          x: -3,
          y: -35
        },
        {
          id: 2,
          name: 'right eye',
          x: 3,
          y: -35
        },
        {
          id: 3,
          name: 'left ear',
          x: -7,
          y: -32
        },
        {
          id: 4,
          name: 'right ear',
          x: 7,
          y: -32
        },
        {
          id: 5,
          name: 'left shoulder',
          x: -13,
          y: -20
        },
        {
          id: 6,
          name: 'right shoulder',
          x: 13,
          y: -20
        },
        {
          id: 7,
          name: 'left wrist',
          x: -15,
          y: 10
        },
        {
          id: 8,
          name: 'right wrist',
          x: 15,
          y: 10
        },
        {
          id: 9,
          name: 'left hip',
          x: -8,
          y: 10
        },
        {
          id: 10,
          name: 'right hip',
          x: 8,
          y: 10
        },
        {
          id: 11,
          name: 'left knee',
          x: -9,
          y: 30
        },
        {
          id: 12,
          name: 'right knee',
          x: 9,
          y: 30
        },
        {
          id: 13,
          name: 'left ankle',
          x: -10,
          y: 45
        },
        {
          id: 14,
          name: 'right ankle',
          x: 10,
          y: 45
        }
      ],
      edgeList: [
        {
          id: 0,
          from: 0,
          to: 1
        },
        {
          id: 1,
          from: 0,
          to: 2
        },
        {
          id: 2,
          from: 0,
          to: 3
        },
        {
          id: 3,
          from: 0,
          to: 4
        },
        {
          id: 4,
          from: 0,
          to: 9
        },
        {
          id: 5,
          from: 0,
          to: 10
        },
        {
          id: 6,
          from: 5,
          to: 7
        },
        {
          id: 7,
          from: 5,
          to: 6
        },
        {
          id: 8,
          from: 6,
          to: 8
        },
        {
          id: 9,
          from: 9,
          to: 11
        },
        {
          id: 10,
          from: 11,
          to: 13
        },
        {
          id: 11,
          from: 10,
          to: 12
        },
        {
          id: 12,
          from: 12,
          to: 14
        }
      ]
    }
  ],

  currentThumbnailActionLabelId: null
}

export const useConfigurationStore = defineStore('configuration', () => {
  const defaultConfiguration = deepClone(DEFAULT_CONFIGURATION)
  const state = reactive(DEFAULT_CONFIGURATION)

  const objectLabelData = JSON.parse(localStorage.getItem(OBJECT_LABEL_LS_KEY))
  const actionLabelData = JSON.parse(localStorage.getItem(ACTION_LABEL_LS_KEY))
  const skeletonTypeData = JSON.parse(
    localStorage.getItem(SKELETON_LABEL_LS_KEY))

  if (objectLabelData) state.objectLabelData = objectLabelData
  if (actionLabelData) state.actionLabelData = actionLabelData
  if (skeletonTypeData) state.skeletonTypeData = skeletonTypeData

  watch(() => state.objectLabelData, (newValue) => {
    localStorage.setItem(OBJECT_LABEL_LS_KEY, JSON.stringify(newValue))
  }, { deep: true })
  watch(() => state.actionLabelData, (newValue) => {
    localStorage.setItem(ACTION_LABEL_LS_KEY, JSON.stringify(newValue))
  }, { deep: true })
  watch(() => state.skeletonTypeData, (newValue) => {
    localStorage.setItem(SKELETON_LABEL_LS_KEY, JSON.stringify(newValue))
  }, { deep: true })

  const importObjectLabelData = (objectLabelData) => {
    validateObjectLabelData(objectLabelData)
    state.objectLabelData = objectLabelData
  }
  const importActionLabelData = (actionLabelData) => {
    validateActionLabelData(actionLabelData)
    state.actionLabelData = actionLabelData
  }
  const importSkeletonTypeData = (skeletonTypeData) => {
    validateSkeletonTypeData(skeletonTypeData)
    state.skeletonTypeData = skeletonTypeData
  }
  return {
    ...toRefs(state),
    reset: () => {
      Object.keys(state).map(key => state[key] = defaultConfiguration[key])
    },
    exportConfig: () => {
      return {
        objectLabelData: state.objectLabelData,
        actionLabelData: state.actionLabelData,
        skeletonTypeData: state.skeletonTypeData
      }
    },
    importObjectLabelData,
    importActionLabelData,
    importSkeletonTypeData,
    importConfig: (data) => {
      const { objectLabelData, actionLabelData, skeletonTypeData } = data
      importObjectLabelData(objectLabelData)
      importActionLabelData(actionLabelData)
      importSkeletonTypeData(skeletonTypeData)
    }
  }
})
