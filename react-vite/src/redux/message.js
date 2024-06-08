import { getChannelMessages, createChannelMessage, updateChannelMessage, deleteChannelMessage } from "../utils/api";

export const LOAD_MESSAGES = 'messages/LOAD_MESSAGES';
export const ADD_MESSAGE = 'messages/ADD_MESSAGE';
export const UPDATE_MESSAGE = 'messages/UPDATE_MESSAGE';
export const DELETE_MESSAGE = 'messages/DELETE_MESSAGE';

// ================= ACTION CREATORS ================= 
export const loadMessages = (messages) => ({
    type: LOAD_MESSAGES,
    messages
});

export const addMessage = (message) => ({
    type: ADD_MESSAGE,
    message
});

export const updateMessage = (message) => ({
    type: UPDATE_MESSAGE,
    message
});

export const deleteMessage = (messageId, channelId) => ({
    type: DELETE_MESSAGE,
    messageId,
    channelId
});

// ================= THUNKS ================= 
export const fetchChannelMessagesThunk = (channelId) => async (dispatch) => {
    const res = await getChannelMessages(channelId);
    dispatch(loadMessages(res));
};

export const createMessageThunk = (channelId, message) => async (dispatch) => {
    const newMessage = await createChannelMessage(channelId, message);
    dispatch(addMessage(newMessage));
    // Fetch the latest messages after creating a new message
    dispatch(fetchChannelMessagesThunk(channelId));
};

export const updateMessageThunk = (messageId, newText, channelId) => async (dispatch) => {
    const updatedMessage = await updateChannelMessage(messageId, newText);
    dispatch(updateMessage(updatedMessage));
    // Fetch the latest messages after updating a message
    dispatch(fetchChannelMessagesThunk(channelId));
};

export const deleteMessageThunk = (messageId, channelId) => async (dispatch) => {
    await deleteChannelMessage(messageId);
    dispatch(deleteMessage(messageId, channelId));
    // Fetch the latest messages after deleting a message
    dispatch(fetchChannelMessagesThunk(channelId));
};


// ================= REDUCER ================= 
const initialState = {};

const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_MESSAGES: {
            const newState = {};
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
        case UPDATE_MESSAGE: {
            const newState = { ...state };
            const channelMessages = newState[action.message.channel_id].map(msg =>
                msg.message_id === action.message.message_id ? action.message : msg
            );
            newState[action.message.channel_id] = channelMessages;
            return newState;
        }
        case DELETE_MESSAGE: {
            const newState = { ...state };
            const channelMessages = newState[action.channelId].filter(msg =>
                msg.message_id !== action.messageId
            );
            newState[action.channelId] = channelMessages;
            return newState;
        }
        default:
            return state;
    }
};

export default messageReducer;
