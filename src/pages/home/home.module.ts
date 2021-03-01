import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HomePage} from "./home";
import {SearchPage} from "./search/search";
import {GoodTeacherPage} from "./good-teacher/good-teacher";
import {ComponentsModule} from "../../components/components.module";
import {NoDevPage} from "./no-dev/no-dev";
import {TestCenterPage} from "./test/test-center/test-center";
import {DoTestPage} from "./test/do-test/do-test";
import {LookTestPage} from "./test/look-test/look-test";
import {LivePage} from "./live/live";
import {DoQuestionPage} from "./question/do-question/do-question";
import {LookQuestion} from "./question/look-question/look-question";
import {MyQuestion} from "./question/my-question/my-question";
import {InnerTrainPage} from "./inner-train/inner-train";
import {FocusTrainPage} from "./focus-train/focus-train";
import {StudyPlanPage} from "./study-plan/study-plan";
import {JobLevelPage} from "./job-level/job-level";
import {JobLevelInfoPage} from "./job-level-info/job-level-info";
import {VotePage} from "./vote/vote";

import {VideoListsPage} from "./short-video/video-lists/video-lists";
import {VideoBoxPage} from "./short-video/video-box/video-box";
import {CompetitionListsPage} from "./competition/lists/lists";
import {CompetitionFWPage} from "./fw-competition/lists/lists";
import {EditPage} from "./competition/edit/edit";
import {ListsRankingPage} from "./competition/lists-ranking/lists-ranking";
import {TotalRankingPage} from "./competition/total-ranking/total-ranking";
import {VideoReplyPage} from "./short-video/video-reply/video-reply";
import {ReplyInputPage} from "./short-video/reply-input/reply-input";
import {PipesModule} from "../../pipes/pipes.module";
import {CompetitionVideoPage} from "./competition/competition-video/competition-video";
import {FwVideoPage} from "./fw-competition/fw-video/fw-video";
import {SimulationTestPage} from "./simulation-test/simulation-test";
import {SimulationDoTestPage} from "./simulation-test/simulation-do-test/simulation-do-test";
import {SimulationLookTestPage} from "./simulation-test/simulation-look-test/simulation-look-test";
import {TreeModule} from 'ng2-tree'

import {AdvancedLevelPage} from "./advanced/level/level";
import {AdvancedListsPage} from "./advanced/lists/lists";
import {RoleModalPage} from "./role-modal/role-modal";
import {RuleModalPage} from "./advanced/rule-modal/rule-modal";
import {StudyTaskPage} from "./study-task/study-task";

import {InformationZonePage} from "./information-zone/information-zone";
import {WantToAskListsPage} from "./want-to-ask/ask-lists/ask-lists";
import {askSearchModalPage} from "./want-to-ask/ask-search-modal/ask-search-modal";
import {AddAskPage} from "./want-to-ask/add-ask/add-ask";
import {WantToAskDetailPage} from "./want-to-ask/ask-detail/ask-detail";

@NgModule({
    declarations: [
        HomePage,
        SearchPage,
        GoodTeacherPage,
        NoDevPage,
        TestCenterPage,
        DoTestPage,
        LookTestPage,
        LivePage,
        DoQuestionPage,
        LookQuestion,
        MyQuestion,
        InnerTrainPage,
        FocusTrainPage,
        StudyPlanPage,
        JobLevelPage,
        JobLevelInfoPage,
        VotePage,
        VideoListsPage,
        VideoBoxPage,
        CompetitionListsPage,
        CompetitionFWPage,
        ListsRankingPage,
        EditPage,
        TotalRankingPage,
        VideoReplyPage,
        RoleModalPage,
        RuleModalPage,
        ReplyInputPage,
        CompetitionVideoPage,
        FwVideoPage,
        SimulationTestPage,
        SimulationDoTestPage,
        SimulationLookTestPage,
        AdvancedLevelPage,
        AdvancedListsPage,
        StudyTaskPage,
        InformationZonePage,
        WantToAskListsPage,
				askSearchModalPage,
				AddAskPage,
				WantToAskDetailPage,
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        ComponentsModule,
        PipesModule,
        TreeModule
    ],
    entryComponents: [
        SearchPage,
        GoodTeacherPage,
        NoDevPage,
        TestCenterPage,
        DoTestPage,
        LookTestPage,
        LivePage,
        DoQuestionPage,
        LookQuestion,
        MyQuestion,
        InnerTrainPage,
        FocusTrainPage,
        StudyPlanPage,
        JobLevelPage,
        JobLevelInfoPage,
        VotePage,
        VideoListsPage,
        VideoBoxPage,
        CompetitionListsPage,
        CompetitionFWPage,
        ListsRankingPage,
        EditPage,
        TotalRankingPage,
        VideoReplyPage,
        RoleModalPage,
        RuleModalPage,
        ReplyInputPage,
        CompetitionVideoPage,
        FwVideoPage,
        SimulationTestPage,
        SimulationDoTestPage,
        SimulationLookTestPage,
        AdvancedLevelPage,
        AdvancedListsPage,
        StudyTaskPage,
        InformationZonePage,
        WantToAskListsPage,
				askSearchModalPage,
				AddAskPage,
				WantToAskDetailPage,
    ]
})
export class HomeModule {
}
