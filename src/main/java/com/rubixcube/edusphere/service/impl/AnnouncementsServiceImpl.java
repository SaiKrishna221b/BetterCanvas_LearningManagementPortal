package com.rubixcube.edusphere.service.impl;

import com.rubixcube.edusphere.dao.AnnouncementsDao;
import com.rubixcube.edusphere.model.Announcements;
import com.rubixcube.edusphere.model.Syllabus;
import com.rubixcube.edusphere.service.AnnouncementsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementsServiceImpl implements AnnouncementsService {

    @Autowired
    private AnnouncementsDao announcementsDao;

    public List<Announcements> getAnnouncementsBySemidAndCourseid(String semID, long courseID){

        return announcementsDao.findAnnouncementsBySemidAndCourseid(semID, courseID);
    }

    public Announcements createNewAnnouncement(Announcements announcement){

        return announcementsDao.save(announcement);

    }

    public List<Announcements> getAnnouncementsBySemAndCourse(String semid, long courseID) {
        return announcementsDao.getAnnouncementsBySemAndCourse(semid, courseID).orElse(null);
    }

}
