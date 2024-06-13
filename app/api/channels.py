from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from app.models import Channel, db, ChannelMessage, Reaction, UserReaction, ChatRoomMessage, User
from app.forms import NewChannelForm
from sqlalchemy.orm import joinedload

channels_bp = Blueprint("channels", __name__)

"""
----------------------> MESSAGES ROUTES <----------------------
"""

# Get all messages in a channel
@channels_bp.route('/<int:channel_id>/messages', methods=['GET'])
@login_required
def get_channel_messages(channel_id):
    channel = Channel.query.get_or_404(channel_id)
    print("Channel Backend CHANNEL", channel)
    
    messages_with_users = (
        db.session.query(ChannelMessage)
            .filter(ChannelMessage.channel_id == channel_id)
            .all()
    )
    print("Channel Backend MESSAGES TUPLE", messages_with_users)
    print("=============================================================================================================================================================================================")
    print("Channel Backend MESSAGES DICTIONARY", messages_with_users[0].to_dict())
    print("=============================================================================================================================================================================================")

    messages_dict = [
        {
            'message_id': message.id,
            'user': {
                'id': message.user.id,
                'username': message.user.username,
                'email': message.user.email,
                'profile_images': [profile_image.to_dict() for profile_image in message.user.profile_images]
            },
            'reactions': [reaction.to_dict() for reaction in message.reactions],
            'channel_id': message.channel_id,
            'text_field': message.text_field,
            'created_at': message.created_at,
            'updated_at': message.updated_at
        }
        for message in messages_with_users
    ]

    print("MESSAGES DICTIONARY!!!!", messages_dict)
    return jsonify(messages_dict)


# Create a new message in a channel
@login_required
@channels_bp.route('/<int:channel_id>/messages', methods=['POST'])
def create_channel_message(channel_id):
    try:
        channel = Channel.query.get_or_404(channel_id)
        data = request.get_json() 
        text = data.get("text_field") 
        user_id = data.get("user_id")

        if not text:
            print(f"Attempt to create a message without text by user {current_user.id}")
            return jsonify({'error': 'Text field is required'}), 400  

        new_message = ChannelMessage(
            user_id=current_user.id,
            channel_id=channel_id,
            text_field=text
        )
        db.session.add(new_message)
        db.session.commit()

        user = User.query.get(current_user.id)

        message_dict = {
            'message_id': new_message.id,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'profile_image': [profile_image.to_dict() for profile_image in user.profile_images]
            },
            'channel_id': new_message.channel_id,
            'text_field': new_message.text_field,
            'created_at': new_message.created_at,
            'updated_at': new_message.updated_at
        }

        return jsonify(message_dict), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating message: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


# Update a message by its ID
@channels_bp.route('/channel_messages/<int:message_id>', methods=['PUT'])
@login_required
def update_channel_message(message_id):
    try:
        message = ChannelMessage.query.get_or_404(message_id)
        
        if message.user_id != current_user.id:
            print(f"Unauthorized attempt to update message by user {current_user.id}")
            return jsonify({'error': 'Unauthorized'}), 403

        data = request.get_json() 
        text_field = data.get('text_field')
        
        if text_field is None:
            return jsonify({'error': 'Text field is required'}), 400 

        message.text_field = text_field  
        db.session.commit()

        return jsonify(message.to_dict()) 
    except Exception as e:
        db.session.rollback()
        print(f"Error updating message: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


# Delete a message by its ID
@channels_bp.route('/channel_messages/<int:message_id>', methods=['DELETE'])
@login_required
def delete_channel_message(message_id):
    try:
        message = ChannelMessage.query.get_or_404(message_id)
        
        if message.user_id != current_user.id:
            print(f"Unauthorized attempt to delete message by user {current_user.id}")
            return jsonify({'error': 'Unauthorized'}), 403

        db.session.delete(message)
        db.session.commit()
        return jsonify({'message': 'Message deleted'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting message: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


"""
----------------------> REACTION ROUTES <----------------------
"""

# Get all reactions on a channel message
@channels_bp.route('/channel_messages/<int:message_id>/reactions', methods=['GET'])
@login_required
# def get_channel_message_reactions(message_id):
#     message = ChannelMessage.query.get_or_404(message_id)  # Get the channel message or return 404 if not found
#     # reactions = Reaction.query.filter_by(channel_message_id=message_id).all()  # Get all reactions on the message
#     # print("ALL MESSAGE REACTIONS", reactions)
#     # return jsonify([reaction.to_dict() for reaction in reactions])  # Return reactions as JSON

#     reactions = (
#         db.session.query(Reaction, UserReaction, User)
#         .join(UserReaction, Reaction.id == UserReaction.reaction_id)
#         .join(User, UserReaction.user_id == User.id)
#         .filter(Reaction.channel_message_id == message_id)
#         .all()
#     )
#     print("ALL MESSAGE REACTIONS", reactions)

#     reaction_dicts = []
#     for reaction, user_reaction, user in reactions:
#         reaction_dict = reaction.to_dict()
#         user_dict = user.to_dict()
#         reaction_dict['user'] = user_dict
#         reaction_dicts.append(reaction_dict)
    
#     print("REACTION DICTIONARY", reaction_dicts)

#     result = []

#     for reaction in reaction_dicts:
#         react_dict = {
#             "id": reaction['id'],
#             "channel_message_id": reaction['channel_message_id'],
#             "resource_type": reaction['resource_type'],
#             "emoji": reaction['emoji'],
#             "count": reaction['count'],
#             "user_id": reaction['user']['id'] 
#         }
#         result.append(react_dict)
    
#     print("RESULTS", result)

#     return jsonify(result)

#==================================TESTING===========================================
def get_channel_message_reactions(message_id):
    message = ChannelMessage.query.get_or_404(message_id)  # Get the channel message or return 404 if not found

    reactions = (
        db.session.query(Reaction, UserReaction, User)
        .join(UserReaction, Reaction.id == UserReaction.reaction_id)
        .join(User, UserReaction.user_id == User.id)
        .filter(Reaction.channel_message_id == message_id)
        .all()
    )

    reaction_dict = {}
    
    # for reaction, user_reaction, user in reactions:
    #     emoji = reaction.emoji
    #     if emoji not in reaction_dict:
    #         reaction_dict[emoji] = {
    #             "id": [reaction.id],
    #             "channel_message_id": reaction.channel_message_id,
    #             "resource_type": reaction.resource_type,
    #             "emoji": reaction.emoji,
    #             "count": reaction.count,
    #             "user_ids": [user.id]
    #         }
    #     else:
    #         reaction_dict[emoji]["id"].append(reaction.id)
    #         reaction_dict[emoji]["count"] += reaction.count
    #         reaction_dict[emoji]["user_ids"].append(user.id)
    
    # combined_reactions = list(reaction_dict.values())

    for reaction, user_reaction, user in reactions:
        emoji = reaction.emoji
        if emoji not in reaction_dict:
            reaction_dict[emoji] = []

        reaction_data = {
            "id": reaction.id,
            "channel_message_id": reaction.channel_message_id,
            "resource_type": reaction.resource_type,
            "emoji": reaction.emoji,
            "user_id": user.id
        }

        reaction_dict[emoji].append(reaction_data)
    
    print("Channels Backend Reaction Dict", reaction_dict)
    return jsonify(reaction_dict)

#==================================TESTING===========================================
# Get reaction by id
@channels_bp.route('/channel_messages/<int:message_id>/reactions/<int:reaction_id>', methods=['GET'])
@login_required
def get_channel_message_reaction_by_id(message_id, reaction_id):
    reaction_with_user = db.session.query(Reaction, User).select_from(Reaction).join(UserReaction, UserReaction.reaction_id == Reaction.id).join(User, UserReaction.user_id == User.id).filter(
        Reaction.id == reaction_id,
        Reaction.channel_message_id == message_id
    ).first_or_404()

    reaction_data = {
        'reaction': reaction_with_user.Reaction.to_dict(),
        'user': {
            'id': reaction_with_user.User.id,
            'username': reaction_with_user.User.username
        }
    }

    print("Reaction by ID", reaction_data)
    return jsonify(reaction_data)


# Get all reactions on a chat room message
@channels_bp.route('/chat_room_messages/<int:message_id>/reactions', methods=['GET'])
@login_required
def get_chat_room_message_reactions(message_id):
    message = ChatRoomMessage.query.get_or_404(message_id)  # Get the chat room message or return 404 if not found
    reactions = Reaction.query.filter_by(chat_room_message_id=message_id).all()  # Get all reactions on the message
    return jsonify([reaction.to_dict() for reaction in reactions])  # Return reactions as JSON

# # Add a reaction to a channel message
@channels_bp.route('/channel_messages/<int:message_id>/reactions', methods=['POST'])
@login_required
# def add_channel_message_reaction(message_id):
#     message = ChannelMessage.query.get_or_404(message_id)
#     print("ADDING REACTION", message.to_dict())
#     reaction_list = [reaction.to_dict() for reaction in message.reactions]
#     print("LOOKING AT A MESSAGE REACTION", reaction_list)
#     data = request.get_json()
#     emoji = data.get('emoji')
#     print("ADDED EMOJI", emoji)

#     for reaction in reaction_list:
#         print("LOOPING THROUGH REACTION LIST", reaction)
#         if emoji == reaction['emoji']:
#             print("EMOJI AND REACTION ARE THE SAME")
#             curr_reaction = Reaction.query.get_or_404(reaction['id'])
#             print("CURRENT REACTION COUNT", curr_reaction.count)
#             curr_reaction.count += 1
#             print("NEW REACTION COUNT", curr_reaction.count)
#             db.session.commit()
#             print("NEW REACTION JSON", jsonify(reaction))
#             return jsonify(reaction)
    
#     if not emoji:
#         return jsonify({'error': 'Emoji is required'}), 400
    
#     new_reaction = Reaction(
#         channel_message_id=message_id,
#         resource_type='channel_message',
#         emoji=emoji,
#         count=1
#     )
#     db.session.add(new_reaction)
#     db.session.commit()
    
#     user_reaction = UserReaction(
#         user_id=current_user.id,
#         reaction_id=new_reaction.id
#     )
#     db.session.add(user_reaction)
#     db.session.commit()
    
#     return jsonify(new_reaction.to_dict()), 201

#==================================TESTING===========================================

def add_channel_message_reaction(message_id):
    try:
        message = ChannelMessage.query.get_or_404(message_id)  # Get the message or return 404 if not found
        data = request.get_json()
        emoji = data.get('emoji')

        if not emoji:
            return jsonify({'error': 'Emoji is required'}), 400

        # Create a new reaction with the provided emoji
        new_reaction = Reaction(
            channel_message_id=message_id,
            resource_type='channel_message',
            emoji=emoji,
            count=1
        )
        db.session.add(new_reaction)
        db.session.commit()

        # Associate the new reaction with the current user
        user_reaction = UserReaction(
            user_id=current_user.id,
            reaction_id=new_reaction.id
        )
        db.session.add(user_reaction)
        db.session.commit()

        return jsonify(new_reaction.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error adding reaction: {e}")  # Log the error
        return jsonify({'error': 'Internal Server Error'}), 500
#==================================TESTING===========================================

# Add a reaction to a chat room message
@channels_bp.route('/chat_room_messages/<int:message_id>/reactions', methods=['POST'])
@login_required
def add_chat_room_message_reaction(message_id):
    message = ChatRoomMessage.query.get_or_404(message_id)  # Get the chat room message or return 404 if not found
    data = request.get_json()  # Get the JSON data from the request
    emoji = data.get('emoji')  # Get the emoji from the data
    
    if not emoji:
        return jsonify({'error': 'Emoji is required'}), 400  # Return error if emoji is missing
    
    new_reaction = Reaction(
        chat_room_message_id=message_id,
        resource_type='chat_room_message',
        emoji=emoji,
        count=1
    )
    db.session.add(new_reaction)  # Add the new reaction to the session
    db.session.commit()  # Commit the session to save the reaction
    
    user_reaction = UserReaction(
        user_id=current_user.id,  # Use the current user's ID
        reaction_id=new_reaction.id
    )
    db.session.add(user_reaction)  # Add the user's reaction to the session
    db.session.commit()  # Commit the session to save the user's reaction
    
    return jsonify(new_reaction.to_dict()), 201  # Return the new reaction as JSON

# Remove a user's reaction from a message
@channels_bp.route('/reactions/<int:reaction_id>', methods=['DELETE'])
@login_required
def delete_reaction(reaction_id):
    print("DELETE REACTION BACKEND", reaction_id)
    reaction = Reaction.query.get_or_404(reaction_id)

    user_reaction = UserReaction.query.filter_by(user_id=current_user.id, reaction_id=reaction_id).first()
    
    if not user_reaction:
        return jsonify({'error': 'Unauthorized or reaction not found'}), 403
    
    db.session.delete(user_reaction)
    db.session.commit()
    
    reaction.count -= 1
    if reaction.count == 0:
        db.session.delete(reaction)
    db.session.commit()
    
    return jsonify({'message': 'Reaction removed'}), 200  # Return success message

"""
----------------------> CHANNEL ROUTES <----------------------
"""
@channels_bp.route('/<int:channel_id>', methods=["PUT"])
@login_required
def update_channel(channel_id):
    print("HELLO UPDATE CHANNEL")
    form = NewChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        channel_name = form.name.data
        user_id = current_user.id

        channel = Channel.query.get_or_404(channel_id)
        print("PUT CHANNEL(FLASK BACKEND):", channel)
        if channel.owner_id != current_user.id:
            return jsonify({"error": "Unauthorized"}), 403

        channel.name = channel_name

        db.session.commit()

        return jsonify(channel.to_dict()), 200
    else:
        print(form.errors)
        return form.errors, 401

@channels_bp.route('/<int:channel_id>', methods=["DELETE"])
@login_required
def delete_channel(channel_id):
    channel = Channel.query.get_or_404(channel_id)

    if channel.owner_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403
    
    db.session.delete(channel)
    db.session.commit()
    return jsonify({'message': 'Channel deleted'}), 200

