import messages from '../utils/messages';
import utils from '../utils/utils';
import codes from '../utils/codes';
import queries from '../utils/queries';

const viewAllUsersAnnouncements = async (req, res) => {
  // Retrieve announcements
  const announcements = await queries.fetchAllUsersAnnouncements();
  if (announcements.rows.length === 0) {
    return utils.returnError(res, codes.statusCodes.notFound, messages.announcementDoesntExist);
  }
  return res.status(200).json({
    status: 200,
    data: announcements.rows,
  });
};

export default {
  viewAllUsersAnnouncements,
};
