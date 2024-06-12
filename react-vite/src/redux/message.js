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

export const loadReactions = (reactions, messageId) => (console.log("THIS IS THE REACTIONS", reactions), {
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
    const res = await getChannelMessages(channelId);
    console.log("Message Redux FETCH CHANNEL MESSAGES", res)
    dispatch(loadMessages(res));
};

export const createMessageThunk = (channelId, message, userId) => async (dispatch) => {
    console.log("Message Redux CREATE MESSAGE THUNK", channelId, message, userId)
    const newMessage = await createChannelMessage(channelId, message, userId);
    console.log("Message Redux NEW MESSAGE", newMessage)
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
    console.log("Message Redux CHECKING MESSAGE ID", messageId)
    const reactions = await getMessageReactions(messageId);
    console.log(reactions, 'THIS IS THE REACTIONS')
    dispatch(loadReactions(reactions, messageId));
};

export const addMessageReactionThunk = (messageId, resourceType, emoji) => async (dispatch) => {
    console.log("Message Redux ADD NEW REACTION", messageId, resourceType, emoji)
    const newReaction = await addMessageReaction(messageId, resourceType, emoji);
    console.log("Message Redux ADD NEW REACTION", newReaction)
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
            const messagesState = {};
            action.messages.forEach((message) => {
                console.log("Message Redux MESSAGE REDUCER LOOP", message)
                messagesState[message.message_id] = message;
            })
            return messagesState;
        }
        case ADD_MESSAGE: {
            // const newState = { ...state };
            // const channelMessages = newState[action.message.channel_id] || [];
            // channelMessages.push({
            //     ...action.message,
            //     reactions: action.message.reactions || []  // Ensure reactions is initialized
            // });
            // newState[action.message.channel_id] = channelMessages;
            // return newState;
            console.log("Message Redux ADD MESSAGE REDUCER", { ...state, [action.message.message_id]: action.message})
            return { ...state, [action.message.message_id]: action.message};
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
        // case LOAD_REACTIONS: {
        //     const newState = { ...state };
        //     Object.keys(newState).forEach(channelId => {
        //         newState[channelId] = newState[channelId].map(message => 
        //             message.id === action.messageId ? {
        //                 ...message,
        //                 reactions: action.reactions
        //             } : message
        //         );
        //     });
        //     return newState;
        // }
        // case ADD_REACTION: {
            // const newState = { ...state };
            // console.log("Message redux CHECKING REACTION STATE", newState)
            // Object.keys(newState).forEach(channelId => {
            //     console.log("Message redux CHECKING REACTION STATE", channelId)
            //     newState[channelId] = newState[channelId].map(message => 
            //         message.id === action.messageId ? {
            //             ...message,
            //             reactions: [...(message.reactions || []), action.reaction]
            //         } : message
            //     );
            // });
            // console.log("Message redux CHECKING REACTION STATE", newState)
            // return newState;
            // console.log("Message redux CHECKING REACTION STATE", {...state})
            // console.log("Message redux CHECKING REACTION STATE", action.reaction)
            // console.log("Message redux CHECKING REACTION STATE", {...state, [action.reaction.id]: action.reaction})
            // return {...state, [action.reaction.id]: action.reaction}
        // }
        // case DELETE_REACTION: {
        //     const newState = { ...state };
        //     Object.keys(newState).forEach(channelId => {
        //         newState[channelId] = newState[channelId].map(message => 
        //             message.id === action.messageId ? {
        //                 ...message,
        //                 reactions: (message.reactions || []).filter(
        //                     reaction => reaction.id !== action.reactionId
        //                 )
        //             } : message
        //         );
        //     });
        //     return newState;
        // }
        default:
            return state;
    }
};

export const reactionsReducer = (state = initialState, action) => {
    switch(action.type) {
        
        case LOAD_REACTIONS: {
            // const reactionsState = {};
            // action.reactions.forEach((reaction) => {
            //     reactionsState[reaction.id] = reaction;
            // })
            const reactionsState = {};

            for (const emoji in action.reactions) {
                if (action.reactions.hasOwnProperty(emoji)) {
                    reactionsState[emoji] = action.reactions[emoji];
                }
            }

            console.log("THIS IS THE REACTIONS", reactionsState)
            console.log("THIS IS THE REACTIONS", {...state, [action.messageId]: reactionsState})
            return {...state, [action.messageId]: reactionsState};
        }

        case ADD_REACTION: {
            console.log("Message redux CHECKING REACTION STATE", {...state})
            console.log("Message redux CHECKING REACTION STATE", action.reaction)
            console.log("Message redux CHECKING REACTION STATE", {...state, [action.reaction.id]: action.reaction})
            return {...state, [action.reaction.id]: action.reaction}
        }

        case DELETE_REACTION: {
            const newState = {...state}
            console.log("Reaction Redux", newState)
            return newState
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