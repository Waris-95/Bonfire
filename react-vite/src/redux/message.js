import { getChannelMessages, createChannelMessage, updateChannelMessage, deleteChannelMessage, getMessageReactions, addMessageReaction, deleteReaction } from "../utils/api";

export const LOAD_MESSAGES = 'messages/LOAD_MESSAGES';
export const ADD_MESSAGE = 'messages/ADD_MESSAGE';
export const UPDATE_MESSAGE = 'messages/UPDATE_MESSAGE';
export const DELETE_MESSAGE = 'messages/DELETE_MESSAGE';
export const LOAD_REACTIONS = 'messages/LOAD_REACTIONS';
export const ADD_REACTION = 'messages/ADD_REACTION';
export const DELETE_REACTION = 'messages/DELETE_REACTION';

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

export const loadReactions = (messageId, reactions) => ({
    type: LOAD_REACTIONS,
    messageId,
    reactions,
});

export const addReaction = (messageId, reaction) => ({
    type: ADD_REACTION,
    messageId,
    reaction,
});

export const removeReaction = (messageId, reactionId) => ({
    type: DELETE_REACTION,
    messageId,
    reactionId,
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

export const fetchMessageReactionsThunk = (messageId) => async (dispatch) => {
    const reactions = await getMessageReactions(messageId);
    dispatch(loadReactions(messageId, reactions));
};

export const addMessageReactionThunk = (messageId, resourceType, emoji) => async (dispatch) => {
    const newReaction = await addMessageReaction(messageId, resourceType, emoji);
    dispatch(addReaction(messageId, newReaction));
    dispatch(fetchMessageReactionsThunk(messageId)); // Fetch reactions after adding a new reaction
};

export const deleteMessageReactionThunk = (messageId, reactionId) => async (dispatch) => {
    await deleteReaction(reactionId);
    dispatch(removeReaction(messageId, reactionId));
    dispatch(fetchMessageReactionsThunk(messageId)); // Fetch reactions after deleting a reaction
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
                newState[message.channel_id].push({
                    ...message,
                    reactions: message.reactions || []  // Ensure reactions is initialized
                });
            });
            return newState;
        }
        case ADD_MESSAGE: {
            const newState = { ...state };
            const channelMessages = newState[action.message.channel_id] || [];
            channelMessages.push({
                ...action.message,
                reactions: action.message.reactions || []  // Ensure reactions is initialized
            });
            newState[action.message.channel_id] = channelMessages;
            return newState;
        }
        case UPDATE_MESSAGE: {
            const newState = { ...state };
            const channelMessages = newState[action.message.channel_id].map(msg =>
                msg.message_id === action.message.message_id ? {
                    ...action.message,
                    reactions: action.message.reactions || msg.reactions || []  // Ensure reactions is initialized
                } : msg
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
        case LOAD_REACTIONS: {
            const newState = { ...state };
            if (newState[action.messageId]) {
                newState[action.messageId].reactions = action.reactions;
            } else {
                newState[action.messageId] = { reactions: action.reactions };
            }
            return newState;
        }
        case ADD_REACTION: {
            const newState = { ...state };
            if (newState[action.messageId] && newState[action.messageId].reactions) {
                newState[action.messageId].reactions.push(action.reaction);
            } else {
                newState[action.messageId] = { reactions: [action.reaction] };
            }
            return newState;
        }
        case DELETE_REACTION: {
            const newState = { ...state };
            if (newState[action.messageId] && newState[action.messageId].reactions) {
                newState[action.messageId].reactions = newState[action.messageId].reactions.filter(
                    reaction => reaction.id !== action.reactionId
                );
            }
            return newState;
        }
        default:
            return state;
    }
};

export default messageReducer;
