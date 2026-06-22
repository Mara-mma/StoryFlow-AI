-- AlterTable: remove platform and environment from stories
ALTER TABLE "stories" DROP COLUMN "platform",
DROP COLUMN "environment";

-- AlterTable: rename narration to voiceover, remove camera_direction from scenes
ALTER TABLE "scenes" DROP COLUMN "camera_direction",
RENAME COLUMN "narration" TO "voiceover";
