import { getChannelsForServerId, addChannel, updateChannel, deleteChannel } from "../utils/api"
import { createSelector } from 'reselect';

export const LOAD_CHANNELS = 'channels/LOAD_CHANNELS'
export const LOAD_ONE_CHANNEL = 'channels/LOAD_ONE_CHANNEL'
export const REMOVE_CHANNEL = 'channels/REMOVE_CHANNEL'

// ================= ACTION CREATORS ================= 
export const loadChannels = (channels) => ({
    type: LOAD_CHANNELS,
    channels
})

export const loadOneChannel = (channel) => ({
    type: LOAD_ONE_CHANNEL,
    channel
})

export const removeChannel = (channelId) => ({
    type: REMOVE_CHANNEL,
    channelId
})

// ================= THUNKS ================= 
// export const fetchChannelsForServerIdThunk = (id) => async (dispatch) => {
//     console.log("FETCHING CHANNELS FOR SERVER ID 1", id)
//     const res = await getChannelsForServerId(id);
//     console.log("FETCHING CHANNELS FOR SERVER ID 3", res)

//     dispatch(loadChannels(res));
// }

export const fetchChannelsForServerIdThunk = (id) => async (dispatch) => {
    console.log("FETCHING CHANNELS FOR SERVER ID 1", id)
    const res = await fetch(`/api/servers/${id}/channels`);
    
    if (res.ok) {
        const channels = await res.json()
        console.log("FETCHING CHANNELS FOR SERVER ID 2", channels)
        dispatch(loadChannels(channels))
    }
}

export const addNewChannel = (channel, serverId) => async (dispatch) => {
    const res = await addChannel(channel, serverId);
    dispatch(loadOneChannel(res))
}

export const updateOldChannel = (channel) => async (dispatch) => {
    const res = await updateChannel(channel)
    if (res.error) {
        return res
    } else {
        dispatch(loadOneChannel(res))
    }
}

export const deleteAChannel = (channelId) => async (dispatch) => {
    const res = await deleteChannel(channelId)
    if (res.error) {
        return res
    } else {
        dispatch(removeChannel(res))
    }
}

//=================SELECTORS=================

export const getChannelsArr = createSelector(
    (state) => state.channels,
    (channel) => {
        console.log("CHANNELS SELECTOR", channel)
        return Object.values(channel)
    }
);

// ================= REDUCER ================= 
const channelReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_CHANNELS: {
            const channelsState = {};
            action.channels.forEach((channel) => {
                channelsState[channel.id] = channel;
            })
            console.log("FETCHING CHANNELS FOR SERVER ID 3", channelsState)
            return channelsState;
        }

        case LOAD_ONE_CHANNEL: {
            return { ...state, [action.channel.id]: action.channel};
        }

        case REMOVE_CHANNEL: {
            const newState = {...state};
            delete newState[action.channelId];
            return newState;
        }

        default:
            return state;
    }
}

export default channelReducer;