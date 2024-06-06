import { getChannelMessages, createChannelMessage } from '../utils/api';

// Action Types
export const LOAD_MESSAGES = 'messages/LOAD_MESSAGES';
export const ADD_MESSAGE = 'messages/ADD_MESSAGE';

// Action Creators
export const loadMessages = (messages) => ({
    type: LOAD_MESSAGES,
    messages,
});

export const addMessage = (message) => ({
    type: ADD_MESSAGE,
    message,
});

// Thunks
export const fetchChannelMessagesThunk = (channelId) => async (dispatch) => {
  const messages = await getChannelMessages(channelId);
  console.log("Fetched Messages: ", messages);
  dispatch(loadMessages(messages));
}

export const createMessageThunk = (channelId, message) => async (dispatch) => {
    const newMessage = await createChannelMessage(channelId, message);
    dispatch(addMessage(newMessage));
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
        case ADD_MESSAGE: {
            const newState = { ...state };
            const channelMessages = newState[action.message.channel_id] || [];
            channelMessages.push(action.message);
            newState[action.message.channel_id] = channelMessages;
            return newState;
        }
        default:
            return state;
    }
};

export default messageReducer;
