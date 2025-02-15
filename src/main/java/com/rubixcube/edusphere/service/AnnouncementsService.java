package com.rubixcube.edusphere.service;

import com.rubixcube.edusphere.model.Announcements;
import com.rubixcube.edusphere.model.Semester;
import java.util.List;

public interface AnnouncementsService {

    List<Announcements> getAnnouncementsBySemidAndCourseid(String semID,long courseID);

    Announcements createNewAnnouncement(Announcements announcement);

    List<Announcements> getAnnouncementsBySemAndCourse(String semid, long courseID);


}

