// Controller for handling success story requests
const StoryService = require("../services/storyService");

class StoryController {
  // GET /api/stories - Get all success stories
  static async getAllStories(req, res) {
    try {
      const stories = await StoryService.getAllStories();
      res.status(200).json(stories);
    } catch (error) {
      console.error("Error in getAllStories:", error);
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/stories/:id - Get single story
  static async getStoryById(req, res) {
    try {
      const { id } = req.params;
      const story = await StoryService.getStoryById(id);
      res.status(200).json(story);
    } catch (error) {
      console.error("Error in getStoryById:", error);
      res.status(404).json({ message: error.message });
    }
  }

  // POST /api/stories - Create new story
  static async createStory(req, res) {
    try {
      const { title, description, testimonial, postedBy } = req.body;

      let imageData = null;
      if (req.file) {
        imageData = "data:" + req.file.mimetype + ";base64," + req.file.buffer.toString("base64");
      }

      const storyData = {
        title,
        description,
        testimonial,
        postedBy,
        image: imageData,
      };

      const newStory = await StoryService.createStory(storyData);
      res.status(201).json({ message: "Story posted successfully", story: newStory });
    } catch (error) {
      console.error("Error in createStory:", error);
      res.status(400).json({ message: error.message });
    }
  }

  // PUT /api/stories/:id - Update story
  static async updateStory(req, res) {
    try {
      const { id } = req.params;
      const updatedStory = await StoryService.updateStory(id, req.body);
      res.status(200).json({ message: "Story updated successfully", story: updatedStory });
    } catch (error) {
      console.error("Error in updateStory:", error);
      res.status(400).json({ message: error.message });
    }
  }

  // DELETE /api/stories/:id - Delete story
  static async deleteStory(req, res) {
    try {
      const { id } = req.params;
      const result = await StoryService.deleteStory(id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in deleteStory:", error);
      res.status(404).json({ message: error.message });
    }
  }

  // GET /api/stories/stats/overview - Get story stats
  static async getStats(req, res) {
    try {
      const stats = await StoryService.getStoryStats();
      res.status(200).json(stats);
    } catch (error) {
      console.error("Error in getStats:", error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = StoryController;
