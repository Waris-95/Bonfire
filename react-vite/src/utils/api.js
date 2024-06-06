// utils/api.js
import { csrfFetch } from './csrf';

export const getAllServers = async () => {
    const res = await fetch('/api/servers/');
    if (res.ok) {
        return res.json();
    }
    throw new Error('Failed to fetch servers');
};

export const getChannelsForServerId = async (serverId) => {
    const res = await fetch(`/api/servers/${serverId}/channels`)
    .then(res => res.json())
    .catch(e => console.error(e))
    return res;
}

export const getUsersForServerId = async (serverId) => {
    const res = await fetch(`/api/servers/${serverId}/users`)
        .then(res => res.json())
        .catch(e => console.error(e))
        return res;
    }
    
    export const addServer = async (server) => {
        const res = await fetch('/api/servers/', {
            method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(server)
    });
    if (res.ok) {
        return res.json();
    }
    throw new Error('Failed to add server');
}

export const getChannelMessages = async (channelId) => {
    const res = await fetch(`/api/channels/${channelId}/messages`)
        .then(res => res.json())
        .catch(e => console.error(e));
    console.log('API call getChannelMessages response:', res);
    return res;
}

export const createChannelMessage = async (channelId, message) => {
    const res = await fetch(`/api/channels/${channelId}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
    if (res.ok) {
        const data = await res.json();
        console.log('API call createChannelMessage response:', data);
        return data;
    }
    throw new Error('Failed to create message');
};
