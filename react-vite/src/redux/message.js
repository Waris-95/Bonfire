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
    console.log(res, 'IM THE RES')
    dispatch(loadMessages(res));
};

export const createMessageThunk = (channelId, message) => async (dispatch) => {
    const newMessage = await createChannelMessage(channelId, message);
    dispatch(addMessage(newMessage));
    dispatch(fetchChannelMessagesThunk(channelId)); // Fetch the latest messages after creating a new message
};

export const updateMessageThunk = (messageId, newText, channelId) => async (dispatch) => {
    try {
        const updatedMessage = await updateChannelMessage(messageId, { text_field: newText });
        dispatch(updateMessage(updatedMessage));
        dispatch(fetchChannelMessagesThunk(channelId));
    } catch (error) {
        console.error('Failed to update message:', error);
    }
};

export const deleteMessageThunk = (messageId, channelId) => async (dispatch) => {
    await deleteChannelMessage(messageId);
    dispatch(deleteMessage(messageId, channelId));
    dispatch(fetchChannelMessagesThunk(channelId));
};

export const fetchMessageReactionsThunk = (messageId) => async (dispatch) => {
    const reactions = await getMessageReactions(messageId);
    console.log(reactions, 'THIS IS THE REACTIONS')
    dispatch(loadReactions(messageId, reactions));
};

export const addMessageReactionThunk = (messageId, resourceType, emoji) => async (dispatch) => {
    const newReaction = await addMessageReaction(messageId, resourceType, emoji);
    dispatch(addReaction(messageId, newReaction));
    dispatch(fetchMessageReactionsThunk(messageId));
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
                msg.id === action.message.id ? {
                    ...msg,
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
                msg.id !== action.messageId
            );
            newState[action.channelId] = channelMessages;
            return newState;
        }
        case LOAD_REACTIONS: {
            const newState = { ...state };
            Object.keys(newState).forEach(channelId => {
                newState[channelId] = newState[channelId].map(message => 
                    message.id === action.messageId ? {
                        ...message,
                        reactions: action.reactions
                    } : message
                );
            });
            return newState;
        }
        case ADD_REACTION: {
            const newState = { ...state };
            Object.keys(newState).forEach(channelId => {
                newState[channelId] = newState[channelId].map(message => 
                    message.id === action.messageId ? {
                        ...message,
                        reactions: [...(message.reactions || []), action.reaction]
                    } : message
                );
            });
            return newState;
        }
        case DELETE_REACTION: {
            const newState = { ...state };
            Object.keys(newState).forEach(channelId => {
                newState[channelId] = newState[channelId].map(message => 
                    message.id === action.messageId ? {
                        ...message,
                        reactions: (message.reactions || []).filter(
                            reaction => reaction.id !== action.reactionId
                        )
                    } : message
                );
            });
            return newState;
        }
        default:
            return state;
    }
};

export default messageReducer;

// import { getChannelMessages, createChannelMessage } from "../utils/api"

// export const LOAD_MESSAGES = 'messages/LOAD_MESSAGES'
// export const ADD_MESSAGE = 'messages/ADD_MESSAGE';

// // ================= ACTION CREATORS ================= 
// export const loadMessages = (messages) => ({
//     type: LOAD_MESSAGES,
//     messages
// })

// export const addMessage = (message) => ({
//     type: ADD_MESSAGE,
//     message,
// });

// // ================= THUNKS ================= 
// export const fetchChannelMessagesThunk = (id) => async (dispatch) => {
//     const res = await getChannelMessages(id);
//     dispatch(loadMessages(res));
// }

// export const createMessageThunk = (channelId, message, userId) => async (dispatch) => {
//     const newMessage = await createChannelMessage(channelId, message, userId);
//     dispatch(addMessage(newMessage));
// }

// // ================= REDUCER ================= 
// const messageReducer = (state = {}, action) => {
//     switch (action.type) {
//         case LOAD_MESSAGES: {
//             const messagesState = {};
//             action.messages.forEach((message) => {
//                 messagesState[message.message_id] = message;
//             })
//             return messagesState;
//         }
//         case ADD_MESSAGE: {
//             return { ...state, [action.message.message_id]: action.message};
//         }
//         default:
//             return state;
//     }
// }

// export default messageReducer;