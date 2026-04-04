// Business logic for success stories
const SuccessStory = require("../models/SuccessStory");

class StoryService {
  // Fetch all published stories
  static async getAllStories(filters = {}) {
    try {
      const query = { status: "published" };
      if (filters.userId) {
        query.postedBy = filters.userId;
      }
      
      const stories = await SuccessStory.find(query)
        .populate("postedBy", "name email phone")
        .sort({ createdAt: -1 });
      
      return stories;
    } catch (error) {
      throw new Error(`Error fetching stories: ${error.message}`);
    }
  }

  // Fetch single story
  static async getStoryById(storyId) {
    try {
      const story = await SuccessStory.findById(storyId)
        .populate("postedBy", "name email phone");
      
      if (!story) {
        throw new Error("Story not found");
      }
      
      return story;
    } catch (error) {
      throw new Error(`Error fetching story: ${error.message}`);
    }
  }

  // Create new story
  static async createStory(storyData) {
    try {
      // Validate required fields
      if (!storyData.title || storyData.title.trim() === "") {
        throw new Error("Story title is required");
      }
      if (!storyData.description || storyData.description.trim() === "") {
        throw new Error("Story description is required");
      }
      if (!storyData.postedBy) {
        throw new Error("User ID is required");
      }

      const story = new SuccessStory({
        title: storyData.title.trim(),
        description: storyData.description.trim(),
        testimonial: storyData.testimonial ? storyData.testimonial.trim() : "",
        image: storyData.image || null,
        postedBy: storyData.postedBy,
        status: "published",
      });

      const savedStory = await story.save();
      await savedStory.populate("postedBy", "name email phone");
      
      return savedStory;
    } catch (error) {
      throw new Error(`Error creating story: ${error.message}`);
    }
  }

  // Update story
  static async updateStory(storyId, updateData) {
    try {
      const story = await SuccessStory.findByIdAndUpdate(
        storyId,
        { ...updateData, updatedAt: Date.now() },
        { new: true }
      ).populate("postedBy", "name email phone");

      if (!story) {
        throw new Error("Story not found");
      }

      return story;
    } catch (error) {
      throw new Error(`Error updating story: ${error.message}`);
    }
  }

  // Delete story
  static async deleteStory(storyId) {
    try {
      const story = await SuccessStory.findByIdAndDelete(storyId);

      if (!story) {
        throw new Error("Story not found");
      }

      return { message: "Story deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting story: ${error.message}`);
    }
  }

  // Get stats
  static async getStoryStats() {
    try {
      const totalStories = await SuccessStory.countDocuments({ status: "published" });
      const uniqueUsers = await SuccessStory.distinct("postedBy", { status: "published" });

      return {
        totalStories,
        happyMembers: uniqueUsers.length,
        itemsRecovered: totalStories,
      };
    } catch (error) {
      throw new Error(`Error fetching stats: ${error.message}`);
    }
  }
}

module.exports = StoryService;
