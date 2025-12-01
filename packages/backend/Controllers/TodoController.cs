using Amazon.DynamoDBv2.DataModel;
using backend.Dtos;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController(IDynamoDBContext context) : ControllerBase
    {
        // GET: api/<TodoController>
        [HttpGet]
        public async Task<ActionResult<List<Todo>>> Get()
        {
            var allTodos = await context.ScanAsync<Todo>(Array.Empty<ScanCondition>()).GetRemainingAsync();
            return Ok(allTodos);
        }

        // GET api/<TodoController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Todo>> Get(Guid id)
        {
            var dbItem = await context.LoadAsync<Todo>(id);
            return Ok(dbItem);
        }

        // POST api/<TodoController>
        [HttpPost]
        public async Task<ActionResult<Todo>> Post([FromBody] UpdateTodoDto item)
        {
            var newTodo = new Todo
            {
                Title = item.Title,
                Details = item.Details
            };
            await context.SaveAsync(newTodo);
            return Ok(newTodo);
        }

        // PUT api/<TodoController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Todo>> Put(Guid id, [FromBody] UpdateTodoDto item)
        {
            var oldTodo = await context.LoadAsync<Todo>(id);
            if (oldTodo == null)
            {
                return NotFound(new { message = $"Todo with id {id} not found" });
            }
            oldTodo.Title = item.Title;
            oldTodo.Details = item.Details;
            if (item.Status.HasValue)
            {
                oldTodo.Status = item.Status.Value;
            }
            
            await context.SaveAsync(oldTodo);
            return Ok(oldTodo);
        }
        
        // DELETE api/<TodoController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            try
            {
                await context.DeleteAsync<Todo>(id);
                return Ok(new { message = $"Item with id {id} successfully deleted" });
            }
            catch (Exception e)
            {
                return Problem(title: $"There was a problem deleting item with id {id}", detail: $"{e}");
            }
        }
    }
}
