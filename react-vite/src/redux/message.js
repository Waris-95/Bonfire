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

export const loadReactions = (reactions, messageId) => ({
    type: LOAD_REACTIONS,
    reactions,
    messageId
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
    try {
        const res = await getChannelMessages(channelId);
        dispatch(loadMessages(res));
    } catch (error) {
        console.error('Failed to fetch messages:', error);
    }
};

export const createMessageThunk = (channelId, message, userId) => async (dispatch) => {
    try {
        const newMessage = await createChannelMessage(channelId, message, userId);
        dispatch(addMessage(newMessage));
    } catch (error) {
        console.error('Failed to create message:', error);
    }
};

export const updateMessageThunk = (messageId, newText) => async (dispatch) => {
    try {
        const updatedMessage = await updateChannelMessage(messageId, { text_field: newText });
        dispatch(updateMessage(updatedMessage));
    } catch (error) {
        console.error('Failed to update message:', error);
    }
};

export const deleteMessageThunk = (messageId) => async (dispatch) => {
    try {
        await deleteChannelMessage(messageId);
        dispatch(deleteMessage(messageId));
    } catch (error) {
        console.error('Failed to delete message:', error);
    }
};

export const fetchMessageReactionsThunk = (messageId) => async (dispatch) => {
    try {
        const reactions = await getMessageReactions(messageId);
        dispatch(loadReactions(reactions, messageId));
    } catch (error) {
        console.error('Failed to fetch reactions:', error);
    }
};

export const addMessageReactionThunk = (messageId, resourceType, emoji) => async (dispatch) => {
    try {
        const newReaction = await addMessageReaction(messageId, resourceType, emoji);
        dispatch(addReaction(messageId, newReaction));
    } catch (error) {
        console.error('Failed to add reaction:', error);
    }
};

export const deleteMessageReactionThunk = (messageId, reactionId) => async (dispatch) => {
    try {
        await deleteReaction(reactionId);
        dispatch(removeReaction(messageId, reactionId));
    } catch (error) {
        console.error('Failed to delete reaction:', error);
    }
};

// ================= REDUCER ================= 
// const initialState = {};

// const messageReducer = (state = initialState, action) => {
//     switch (action.type) {
//         // case LOAD_MESSAGES: {
//         //     const newState = {};
//         //     action.messages.forEach((message) => {
//         //         if (!newState[message.channel_id]) {
//         //             newState[message.channel_id] = [];
//         //         }
//         //         newState[message.channel_id].push({
//         //             ...message,
//         //             reactions: message.reactions || []  // Ensure reactions is initialized
//         //         });
//         //     });
//         //     return newState;
//         // }
//         // case ADD_MESSAGE: {
//         //     const newState = { ...state };
//         //     const channelMessages = newState[action.message.channel_id] || [];
//         //     channelMessages.push({
//         //         ...action.message,
//         //         reactions: action.message.reactions || []  // Ensure reactions is initialized
//         //     });
//         //     newState[action.message.channel_id] = channelMessages;
//         //     return newState;
//         // }
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
//         // case UPDATE_MESSAGE: {
//         //     const newState = { ...state };
//         //     const channelMessages = newState[action.message.channel_id].map(msg =>
//         //         msg.id === action.message.id ? {
//         //             ...msg,
//         //             ...action.message,
//         //             reactions: action.message.reactions || msg.reactions || []  // Ensure reactions is initialized
//         //         } : msg
//         //     );
//         //     newState[action.message.channel_id] = channelMessages;
//         //     return newState;
//         // }
//         // case UPDATE_MESSAGE: {
//         //     return { ...state, [action.message.message_id]: action.message};
//         // }
//         case DELETE_MESSAGE: {
//             const newState = { ...state };
//             const channelMessages = newState[action.channelId].filter(msg =>
//                 msg.id !== action.messageId
//             );
//             newState[action.channelId] = channelMessages;
//             return newState;
//         }
//         default:
//             return state;
//     }
// };

// export const reactionsReducer = (state = initialState, action) => {
//     switch(action.type) {
        
//         case LOAD_REACTIONS: {
//             // const reactionsState = {};
//             // action.reactions.forEach((reaction) => {
//             //     reactionsState[reaction.id] = reaction;
//             // })
//             const reactionsState = {};

//             for (const emoji in action.reactions) {
//                 if (action.reactions.hasOwnProperty(emoji)) {
//                     reactionsState[emoji] = action.reactions[emoji];
//                 }
//             }

//             return {...state, [action.messageId]: reactionsState};
//         }

//         case ADD_REACTION: {
//             return {...state, [action.reaction.id]: action.reaction}
//         }

//         case DELETE_REACTION: {
//             const newState = {...state}
//             return newState
//         }

//         default:
//             return state;
//     }
// };

// export default messageReducer;

//==========================================================================
//TESTING
//==========================================================================
// Initial State
const initialState = {
    messages: {},
    reactions: {}
};

// Reducer
const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_MESSAGES: {
            const messagesState = {};
            action.messages.forEach((message) => {
                messagesState[message.message_id] = message;
            });
            return { ...state, messages: messagesState };
        }
        case ADD_MESSAGE: {
            return { ...state, messages: { ...state.messages, [action.message.message_id]: action.message } };
        }
        case UPDATE_MESSAGE: {
            return { ...state, messages: { ...state.messages, [action.message.message_id]: action.message } };
        }
        case DELETE_MESSAGE: {
            const newMessages = { ...state.messages };
            delete newMessages[action.messageId];
            return { ...state, messages: newMessages };
        }
        case LOAD_REACTIONS: {
            const newReactions = { ...state.reactions, [action.messageId]: action.reactions };
            return { ...state, reactions: newReactions };
        }
        case ADD_REACTION: {
            const messageReactions = state.reactions[action.messageId] || [];
            return { ...state, reactions: { ...state.reactions, [action.messageId]: [...messageReactions, action.reaction] } };
        }
        case DELETE_REACTION: {
            const messageReactions = state.reactions[action.messageId] || [];
            const filteredReactions = messageReactions.filter(reaction => reaction.id !== action.reactionId);
            return { ...state, reactions: { ...state.reactions, [action.messageId]: filteredReactions } };
        }
        default:
            return state;
    }
};

export default messageReducer;