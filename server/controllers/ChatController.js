import Chat from "../model/Chat.js";

export async function GetChats(req, res) {
  const { chatId } = req.params;
  if (!chatId) {
    return res.status(400).json({ error: "USER ID IS REQUIRED" });
  }
  try {
    const chats = await Chat.findById(chatId);
    if (!chats) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json({ chats: chats.messages });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

export async function GetChatByUserIds(req, res) {
  try {
    const chat = await Chat.findOne({
      participants: { $all: [senderId] },
      participants: { $in: [senderId] },
    });
    res.json(chat.id)
  } catch (error) {
    res.json(error)
  }
}

export async function GetChatsByUsers(req, res) {
  const { user1Id, user2Id } = req.body;

  if (!user1Id || !user2Id) {
    return res.status(400).json({ error: "Both user1Id and user2Id are required" });
  }

  try {
    // Find the chat that has both participants (user1Id and user2Id)
    const chat = await Chat.findOne({
      participants: { $all: [user1Id, user2Id] } // $all ensures both users are in the participants array
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Return the chat messages
    res.status(200).json({ chatId: chat._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function UnreadMessage(req, res) {
  try {
    
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

export async function DeleteChatMessage(req, res) {
  const { chatId, messageId } = req.params;

  if (!chatId || !messageId) {
    return res
      .status(400)
      .json({ error: "Chat ID and Message ID are required" });
  }

  try {
    // Find the chat by chatId
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Find the index of the message to be deleted
    const messageIndex = chat.messages.findIndex(
      (message) => message._id.toString() === messageId
    );

    if (messageIndex === -1) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Remove the message from the array
    chat.messages.splice(messageIndex, 1);

    // Save the updated chat document
    await chat.save();

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
