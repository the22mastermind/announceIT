import messages from '../utils/messages';
import utils from '../utils/utils';
import codes from '../utils/codes';
import queries from '../utils/queries';

const deleteAnnouncement = async (req, res) => {
  const { announcementId } = req.params;
  // Check and retrieve announcement
  const announcement = await queries.checkAnnouncement(parseInt(announcementId, 10));
  if (announcement.rows.length === 0) {
    return utils.returnError(res, codes.statusCodes.notFound, messages.announcementDoesntExist);
  }
  // Delete announcement
  const delAnnnouncement = await queries.dropAnnouncement(parseInt(announcementId, 10));
  return res.status(200).json({
    status: 200,
    message: messages.announcementDeleted,
    data: delAnnnouncement.rows[0],
  });
};

export default {
  deleteAnnouncement,
};
