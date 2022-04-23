const Relationships = require("../models/Relationship");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

exports.addFriend = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.body.fromId && req.body.fromId !== req.body.toId) {
    const request = await Relationships.find({
      partiesInvolved: { $all: [req.body.fromId, req.body.toId] },
    });
    const currentUser = await User.findById(req.user._id);
    const isFriend = currentUser.friends.filter((friend) => {
      return friend._id.toString() === req.body.toId;
    });
    if (request.length > 0) {
      res.status(401);
      throw new Error("Pending Request yet to be attended to");
    }
    if (isFriend.length > 0) {
      res.status(401);
      throw new Error("You are friends with this user already");
    }
    try {
      const addFriend = await Relationships.create({
        fromId: req.body.fromId,
        toId: req.body.toId,
        partiesInvolved: [req.body.fromId, req.body.toId],
        toUsername: req.body.toUsername,
        toProfilephoto: req.body.toProfilephoto,
      });
      if (addFriend) {
        res.status(201).json({ success: true, message: "request sent" });
      } else {
        res.status(401);
        throw new Error(`Invalid Details`);
      }
    } catch (err) {
      res.status(401);
      throw new Error(`${err}`);
    }
  } else {
    res.status(403);
    throw new Error(`You cannot perform this operation`);
  }
});

exports.acceptRequest = asyncHandler(async (req, res) => {
  console.log(req.user._id.toString() === req.body.toId);
  if (req.user._id.toString() === req.body.toId) {
    try {
      const request = await Relationships.find({
        $and: [{ toId: req.user._id }, { partiesInvolved: { $all: [req.body.fromId, req.body.toId] } }],
      });
      if (request.length > 0) {
        const currentUser = await User.findById(request[0].toId);
        const otherUser = await User.findById(request[0].fromId);
        const isFriend = currentUser.friends.filter((friend) => {
          return friend._id.toString() === request[0].fromId.toString();
        });
        if (!(isFriend.length > 0)) {
          await currentUser.updateOne({
            $push: {
              friends: {
                _id: request[0].fromId,
                username: otherUser.username,
                profilePhoto: otherUser.profilePhoto,
              },
            },
          });
          await otherUser.updateOne({
            $push: {
              friends: {
                _id: request[0].toId,
                username: currentUser.username,
                profilePhoto: currentUser.profilePhoto,
              },
            },
          });
          await Relationships.findOneAndDelete({
            partiesInvolved: {
              $all: [req.body.fromId, req.body.toId],
            },
          });
          res.status(200).json({ success: true, message: "Request Accepted" });
        } else {
          res.status(403);
          throw new Error("You are friends already");
        }
      } else {
        res.status(403);
        throw new Error(`Request does not exist`);
      }
    } catch (err) {
      res.status(403);
      throw new Error(`${err}`);
    }
  } else {
    res.status(403);
    throw new Error(`You cannot perform this operation`);
  }
});

exports.rejectRequest = asyncHandler(async (req, res) => {
  const request = await Relationships.find({
    $and: [{ $or: [{ toId: req.user._id }, { fromId: req.user._id }] }, { partiesInvolved: { $all: [req.body.fromId, req.body.toId] } }],
  });
  if (request.length > 0) {
    await Relationships.findOneAndDelete({
      partiesInvolved: {
        $all: [req.body.fromId, req.body.toId],
      },
    });
    res.status(200).json({ success: true, message: "Request successfully cancelled" });
  } else {
    res.status(403);
    throw new Error(`Request does not exist`);
  }
});

exports.getMyRequests = asyncHandler(async (req, res) => {
  const request = await Relationships.find({
    toId: req.user._id,
  });
  if (request.length > 0) {
    res.status(200).json({ success: true, data: request });
  } else {
    res.status(403);
    throw new Error(`You do not have a request`);
  }
});
