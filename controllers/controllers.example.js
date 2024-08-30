/**
 * @description Retrieves an example resource.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const getExample = async (req, res) => {
  try {
    // Write your logic here
    res.status(200).json({ message: "your custom message", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

/**
 * @description Creates a new example resource.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const createExample = async (req, res) => {
  try {
    // Write your logic here
    res.status(200).json({ message: "your custom message", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

/**
 * @description Updates an existing example resource.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const updateExample = async (req, res) => {
  try {
    // Write your logic here
    res.status(200).json({ message: "your custom message", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};

/**
 * @description Deletes an example resource.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const deleteExample = async (req, res) => {
  try {
    // Write your logic here
    res.status(200).json({ message: "your custom message", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, status: false });
  }
};
