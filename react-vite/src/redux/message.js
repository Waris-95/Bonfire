import { createChannelMessage, getChannelMessages } from "../utils/api"

// Action Types
export const LOAD_MESSAGES = 'messages/LOAD_MESSAGES'
export const ADD_MESSAGE = 'messages/ADD_MESSAGE'

// Action Creators
export const loadMessages = (messages) => ({
    type: LOAD_MESSAGES,
    messages
})

export const addMessage = (message) => ({
    type: ADD_MESSAGE,
    message
})

// Thunks
export const fetchChannelMessagesThunk = (id) => async (dispatch) => {
    const res = await getChannelMessages(id);
    if (res) {
        dispatch(loadMessages(res));
    } else {
        console.error('Unexpected API response:', res);
    }
}

export const createMessageThunk = (channelId, message) => async (dispatch) => {
    try {
        const newMessage = await createChannelMessage(channelId, message);
        dispatch(addMessage(newMessage));
    } catch (error) {
        console.error('Failed to create message:', error);
    }
}

const initialState = {};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_MESSAGES: {
            const newState = { ...state };
            action.messages.forEach((message) => {
                if (!newState[message.channel_id]) {
                    newState[message.channel_id] = [];
                }
                newState[message.channel_id].push(message);
            });
            return newState;
        }
        default:
            return state;
    }
}

export default messageReducer;
