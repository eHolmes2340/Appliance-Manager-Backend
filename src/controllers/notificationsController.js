import db from '../model/db.js';


//Functions: getRecallNotifications
//Description: This function retrieves recall notifications for a specific appliances.
// Function: getRecallNotifications
// Description: This function retrieves recall notifications for a specific appliance based on userId.

export const getRecallNotifications = async (req, res) => {
    const userId = req.params.userId; // Get the userId from the URL parameters
  
    // Query to get appliance data for the user and matching recalls
    const applianceQuery = `
        SELECT userAppliances.id, userAppliances.applianceName, userAppliances.model, 
                recalls.recall_heading, recalls.product_name, recalls.description
        FROM userAppliances
        LEFT JOIN recalls ON userAppliances.applianceName = recalls.product_name
        WHERE userAppliances.userId = ? AND recalls.recall_heading IS NOT NULL
        `;
  
    try {
      // Fetch appliance data and matching recalls for the user
      db.db.query(applianceQuery, [userId], (err, results) => {
        if (err) {
          console.error('Error fetching recall notifications: ', err);
          return res.status(500).json({ error: 'Failed to fetch recall notifications' });
        }
  
        // Check if recalls were found
        if (results.length === 0) {
          return res.status(404).json({ message: 'No recall notifications found for this user' });
        }
  
        // Map the results to a list of recall notifications
        const recallNotifications = results.map(recall => ({
          applianceId: recall.id,
          applianceName: recall.applianceName,
          applianceModel: recall.model,
          recallHeading: recall.recall_heading,
          productName: recall.product_name,
          recallDescription: recall.description,
        }));
  
        // Send the recall notifications as a response
        return res.json(recallNotifications);
      });
    } catch (error) {
      console.error('Error in getRecallNotifications: ', error);
      return res.status(500).json({ error: 'An error occurred while retrieving recall notifications' });
    }
  };
  

//Functions: getWarrantyNotifications
//Description: This function retrieves warranty notifications for a specific appliances.
export const getWarrantyNotifications = async (req, res) => {

};