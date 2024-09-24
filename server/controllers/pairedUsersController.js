import PairedUsers from "../model/PairedUsers.js";
import ProfilePicture from "../model/ProfilePictures.js";
import User from '../model/User.js'

export async function GetPaires(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ error: "USER ID IS REQUIRED" });
    }

    try {
        // Find all pairs that include the specified user ID
        const pairedUsers = await PairedUsers.find({ users: id }).populate('users');

        if (pairedUsers.length === 0) {
            return res.status(404).json({ message: "No pairs found for this user" });
        }

        // Fetch profile pictures for each user in the pairs, but filter out the user with the same id as req.params.id
        const pairsWithProfilePictures = await Promise.all(pairedUsers.map(async pair => {
            const usersWithPictures = await Promise.all(pair.users
                .filter(user => user._id.toString() !== id)  // Filter out the user with the same id
                .map(async user => {
                    const profilePicture = await ProfilePicture.findOne({ userId: user._id });
                    return {
                        ...user.toObject(),
                        profilePicture: profilePicture ? profilePicture.image : null,
                    };
                })
            );

            return {
                ...pair.toObject(),
                users: usersWithPictures,
            };
        }));

        res.status(200).json({ pairs: pairsWithProfilePictures });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function GetPairesWithChats(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ error: "USER ID IS REQUIRED" });
    }

    try {
        // Find all pairs that include the specified user ID
        const pairedUsers = await PairedUsers.find({ users: id }).populate('users chats');

        if (pairedUsers.length === 0) {
            return res.status(404).json({ message: "No pairs found for this user" });
        }

        // Fetch profile pictures for each user in the pairs, but filter out the user with the same id as req.params.id
        const pairsWithProfilePictures = await Promise.all(pairedUsers.map(async pair => {
            const usersWithPictures = await Promise.all(pair.users
                .filter(user => user._id.toString() !== id)  // Filter out the user with the same id
                .map(async user => {
                    const profilePicture = await ProfilePicture.findOne({ userId: user._id });
                    return {
                        ...user.toObject(),
                        profilePicture: profilePicture ? profilePicture.image : null,
                    };
                })
            );

            return {
                ...pair.toObject(),
                users: usersWithPictures,
            };
        }));

        res.status(200).json({ pairs: pairsWithProfilePictures });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Return All users that are not pairs
export async function GetNonPairedUsers(req, res) {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ error: "USER ID IS REQUIRED" });
    }

    try {
        // Step 1: Fetch all pairs that include the specified user
        const pairedUsers = await PairedUsers.find({ users: id });

        // Step 2: Extract the IDs of all paired users
        const pairedUserIds = pairedUsers.reduce((acc, pair) => {
            pair.users.forEach(userId => {
                if (userId.toString() !== id) {
                    acc.add(userId.toString());
                }
            });
            return acc;
        }, new Set());

        // Step 3: Fetch all users excluding the current user and already paired users
        const nonPairedUsers = await User.find({
            _id: { $nin: [...pairedUserIds, id] }, // Exclude paired users and the current user
        });

        if (nonPairedUsers.length === 0) {
            return res.status(404).json({ message: "No unpaired users found" });
        }

        // Step 4: Fetch profile pictures for each non-paired user
        const usersWithProfilePictures = await Promise.all(
            nonPairedUsers.map(async (user) => {
                const profilePicture = await ProfilePicture.findOne({ userId: user._id });
                return {
                    ...user.toObject(), // Convert the user document to a plain object
                    profilePicture: profilePicture ? profilePicture.image : null, // Attach profile picture
                };
            })
        );

        // Step 5: Return the non-paired users with their profile pictures
        res.status(200).json({ users: usersWithProfilePictures });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}