import Chat from "../model/Chat.js"
import ConnectionRequest from "../model/ConnectionRequest.js"
import PairedUsers from "../model/PairedUsers.js"
import ProfilePicture from "../model/ProfilePictures.js";

export async function SendRequest(req, res) {
    const { senderId, recipientId } = req.body.connectionRequest
    if(!senderId ||!recipientId) {
        return res.status(400).json({ error: "senderId and recipientId required" })
    }
    try {
        const newRequest = await ConnectionRequest.create({
            senderId: senderId,
            recipientId: recipientId
        })
        res.status(201).json(newRequest)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export async function GetRequests(req, res) {
    const id = req.params.id;

    // Check if user ID is provided
    if (!id) {
        return res.status(400).json({ error: "USER ID IS REQUIRED" });
    }

    try {
        // Find all connection requests where the recipient is the given user ID
        const requests = await ConnectionRequest.find({ recipientId: id }).populate('senderId');

        // If no requests found, return a 404
        if (!requests || requests.length === 0) {
            return res.status(404).json({ message: "You don't have any active requests" });
        }

        // Fetch profile pictures for each sender in the requests
        const requestsWithSenders = await Promise.all(requests.map(async request => {
            const sender = request.senderId; // senderId is populated with user details
            const profilePicture = await ProfilePicture.findOne({ userId: sender._id });

            return {
                ...request.toObject(),
                profilePicture: profilePicture ? profilePicture.image : null,
               
            };
        }));

        // Send back the requests with sender details and profile pictures
        res.status(200).json({ requests: requestsWithSenders });
    } catch (error) {
        // Handle any errors during the process
        res.status(500).json({ error: error.message });
    }
}

export async function AcceptRequest(req, res) {
    const { requestId } = req.params
    if(!requestId) {
        return res.status(400).json({ error: "REQUEST ID IS REQUIRED" })
    }
    try {
        const request = await ConnectionRequest.findById(requestId)
        if(request) {
            request.status = "accepted"
            await request.save()
            const paired= await pairUsers(request.senderId, request.recipientId)
            return res.status(200).json({ message: "Request accepted", paired: paired })
        }
        res.status(404).json({ message: "Request not found" })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

export async function DeclineRequest(req, res) {
    const { requestId } = req.params
    if(!requestId) {
        return res.status(400).json({ error: "REQUEST ID IS REQUIRED" })
    }
    try {
        const request = await ConnectionRequest.findById(requestId)
        if(request) {
            request.status = "declined"
            await request.save()
            const paired= await pairUsers(request.senderId, request.recipientId)
            res.status(200).json({ message: "Request declined", paired: paired })
        }
        res.status(404).json({ message: "Request not found" })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

export async function IgnoreRequest(req, res) {
    const { requestId } = req.params
    if(!requestId) {
        return res.status(400).json({ error: "REQUEST ID IS REQUIRED" })
    }
    try {
        const request = await ConnectionRequest.findById(requestId)
        if(request) {
            request.status = "ignored"
            await request.save()
            const paired= await pairUsers(request.senderId, request.recipientId)
            res.status(200).json({ message: "Request ignored", paired: paired })
        }
        res.status(404).json({ message: "Request not found" })
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function pairUsers(user1, user2)  {
    try {
        // Step 1: Create the PairedUsers document
        const pairedUsers = await PairedUsers.create({
            users: [user1, user2],
        });

        // Step 2: Create the Chat document and associate it with the PairedUsers
        const chat = await Chat.create({
            participants: [user1, user2],
            messages: [], // You can initialize with an empty array or add a welcome message if desired
        });

        // Step 3: Update the PairedUsers document to reference the Chat document
        pairedUsers.chats = chat._id;
        await pairedUsers.save();

        // Step 4: Return the room ID (or other relevant information)
        return { roomId: pairedUsers.roomId, chatId: chat._id };
    } catch (error) {
        return error.message;
    }
}