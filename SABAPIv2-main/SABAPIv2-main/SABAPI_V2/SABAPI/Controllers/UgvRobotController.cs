using SABApi.Models;
using SABApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace SABApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UgvRobotController : ControllerBase
    {
        private readonly UgvRobotService _ugvRobotService;

        public UgvRobotController(UgvRobotService ugvRobotService) =>
            _ugvRobotService = ugvRobotService;

        [HttpGet]
        public async Task<List<UgvRobot>> Get() =>
            await _ugvRobotService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<UgvRobot>> Get(string id)
        {
            var ugvRobot = await _ugvRobotService.GetAsync(id);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            return ugvRobot;
        }

        [HttpPost]
        public async Task<IActionResult> Post(UgvRobot newUgvRobot)
        {
            await _ugvRobotService.CreateAsync(newUgvRobot);

            return CreatedAtAction(nameof(Get), new { id = newUgvRobot.Id }, newUgvRobot);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, UgvRobot updatedUgvRobot)
        {
            var ugvRobot = await _ugvRobotService.GetAsync(id);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            updatedUgvRobot.Id = ugvRobot.Id;

            await _ugvRobotService.UpdateAsync(id, updatedUgvRobot);

            return NoContent();
        }

        [HttpPatch("update-distance/{no}")]
        public async Task<IActionResult> UpdateDistance(int no, [FromBody] DistanceUpdateRequest request)
        {
            var ugvRobot = await _ugvRobotService.GetByNoAsync(no);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            await _ugvRobotService.UpdateDistanceAsync(no, request.NewDistance);

            return NoContent();
        }

        [HttpPatch("update-herbicide/{no}")]
        public async Task<IActionResult> UpdateHerbicide(int no, [FromBody] HerbicideUpdateRequest request)
        {
            var ugvRobot = await _ugvRobotService.GetByNoAsync(no);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            await _ugvRobotService.UpdateHerbicideAsync(no, request.NewHerbicide);

            return NoContent();
        }

        [HttpPatch("update-speed/{no}")]
        public async Task<IActionResult> UpdateSpeed(int no, [FromBody] SpeedUpdateRequest request)
        {
            var ugvRobot = await _ugvRobotService.GetByNoAsync(no);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            await _ugvRobotService.UpdateUgvSpeedAsync(no, request.NewSpeed);

            return NoContent();
        }

        [HttpPatch("update-mission/{no}")]
        public async Task<IActionResult> UpdateMission(int no, [FromBody] MissionUpdateRequest request)
        {
            var ugvRobot = await _ugvRobotService.GetByNoAsync(no);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            await _ugvRobotService.UpdateUgvMissionAsync(no, request.NewMission);

            return NoContent();
        }

        [HttpPatch("update-location/{no}")]
        public async Task<IActionResult> UpdateLocation(int no, [FromBody] LocationUpdateRequest request)
        {
            var ugvRobot = await _ugvRobotService.GetByNoAsync(no);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            await _ugvRobotService.UpdateLocationAsync(no, request);

            return NoContent();
        }

        [HttpPatch("update-info-date/{no}")]
        public async Task<IActionResult> UpdateInfoDate(int no, [FromBody] InfoDateUpdateRequest request)
        {
            var ugvRobot = await _ugvRobotService.GetByNoAsync(no);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            await _ugvRobotService.UpdateInfoDateAsync(no, request.NewInfoDate);

            return NoContent();
        }





        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var ugvRobot = await _ugvRobotService.GetAsync(id);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            await _ugvRobotService.RemoveAsync(id);

            return NoContent();
        }

        [HttpGet("no/{no}")]
        public async Task<ActionResult<UgvRobot>> GetByNo(int no)
        {
            var ugvRobot = await _ugvRobotService.GetByNoAsync(no);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            return ugvRobot;
        }


        [HttpPatch("update-mod/{no}")]
        public async Task<IActionResult> UpdateMod(int no, [FromBody] ModUpdateRequest request)
        {
            var ugvRobot = await _ugvRobotService.GetByNoAsync(no);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            await _ugvRobotService.UpdateModAsync(no, request);

            return NoContent();
        }

        [HttpGet("mod/{no}")]
        public async Task<ActionResult<UgvRobot>> GetMod(int no)
        {
            var ugvRobot = await _ugvRobotService.GetModAsync(no);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            return ugvRobot;
        }


        [HttpPatch("update-mod2/{no}")]
        public async Task<IActionResult> UpdateMod2(int no, [FromBody] ModUpdateRequest request)
        {
            var ugvRobot = await _ugvRobotService.GetByNoAsync(no);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            await _ugvRobotService.UpdateMod2Async(no, request);

            return NoContent();
        }

        [HttpPatch("update-status/{no}")]
        public async Task<IActionResult> UpdateStatus(int no, [FromBody] ModUpdateRequest request)
        {
            var ugvRobot = await _ugvRobotService.GetByNoAsync(no);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            await _ugvRobotService.UpdateStatusAsync(no, request);

            return NoContent();
        }

        [HttpPatch("update-online-status/{no}")]
        public async Task<IActionResult> UpdateOnlineStatus(int no, [FromBody] ModUpdateRequest request)
        {
            var ugvRobot = await _ugvRobotService.GetByNoAsync(no);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            await _ugvRobotService.UpdateOnlineStatusAsync(no, request);

            return NoContent();
        }

        [HttpPatch("update-direction/{id}")]
        public async Task<IActionResult> UpdateDirection(string id, [FromBody] DirectionUpdateRequest request)
        {
            var ugvRobot = await _ugvRobotService.GetByIdAsync(id);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            await _ugvRobotService.UpdateDirectionAsync(id, request);

            return NoContent();
        }



        [HttpPatch("update-manuel-status/{no}")]
        public async Task<IActionResult> UpdateManuelStatus(int no, [FromBody] ManuelStatusUpdateRequests request)
        {
            var ugvRobot = await _ugvRobotService.GetByNoAsync(no);

            if (ugvRobot is null)
            {
                return NotFound();
            }

            await _ugvRobotService.UpdateManuelStatusAsync(no, request);

            return NoContent();
        }


    }
}
