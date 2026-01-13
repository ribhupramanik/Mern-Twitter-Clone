import User from "../models/user.model.js";
import Post from "../models/post.model.js"
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req,res) => {
    try {
        let {text, img} = req.body;
        let userId = req.user._id.toString();

        const user = await User.findById(userId)
        if(!user) return res.status(404).json({message: "User not found"})
        
        if(!text && !img){
            return res.status(400).json({error: "Post does not have text or image"});
        }

        if(img){
            const uploadedResponse = await cloudinary.uploader.upload(img)
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user:userId,
            text,
            img
        })

        await newPost.save();
        res.status(201).json(newPost);
            
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
        console.log("Error in createPost controller");
    }
}

export const deletePost = async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res(404).json({error: "Post not found"})
        }

        if(post.user.toString() !== req.user._id.toString()){
            return res(401).json({error: "You are not authorized to delete this post"})
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({message: "Post deleted successfully"});

    } catch (error) {
        console.log("Error in deletePost controller ", error);
        res.status(500).json({error:"Internal server error"});
    }
};

export const commentOnPost = async(req, res) => {
    try {
        const {text} = req.body
        const postId = req.params.id;
        const userId = req.user._id;

        if(!text){
            return res.status(400).json({error:"Text field is required"});
        }

        const post = await Post.findById(postId)

        if(!post){
            return res.status(404).json({error:"Post not found"});
        }

        const comment = {user: userId, text}

        post.comments.push(comment)
        await post.save()

        res.status(200).json(post)

    } catch (error) {
        console.log("Error in commentController: ", error);
        res.status(500).json({error: "Internal server error"})
    }
}

