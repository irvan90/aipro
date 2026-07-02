import re

filepath = r"C:\File\project\compass\compass\src\app\core\services\ai.service.ts"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the initialization
old_init = """      const timers: ReturnType<typeof setTimeout>[] = [];
      let offset = 0;
      const log = (msg: string) => backlogStore.thinkingLogs.update(logs => [...logs, msg]);"""

new_init = """      const TIME_SCALE = 12; // Scales ~4.5s total offset to ~54s
      const scheduledActions: { time: number, action: () => void }[] = [];
      const pushAction = (time: number, action: () => void) => scheduledActions.push({ time, action });
      
      let offset = 0;
      const log = (msg: string) => backlogStore.thinkingLogs.update(logs => [...logs, msg]);"""

content = content.replace(old_init, new_init, 1)

# Reset fastForward flag at the beginning
content = content.replace("backlogStore.thinkingLogs.set([]);", "backlogStore.thinkingLogs.set([]);\n      backlogStore.fastForwardAnalysis.set(false);")

# Replace all timers.push(setTimeout(...)) with pushAction(...)
def replace_timer(match):
    action = match.group(1)
    delay = match.group(2)
    return f"pushAction(({delay}) * TIME_SCALE, () => {action});"

content = re.sub(r"timers\.push\(setTimeout\(\(\) => (.*?), (.*?)\)\);", replace_timer, content, flags=re.DOTALL)

# Replace the block for agents simultaneously completing, which spans multiple lines
def replace_multiline_timer(match):
    action_body = match.group(1)
    delay = match.group(2)
    return f"pushAction(({delay}) * TIME_SCALE, () => {{\n{action_body}\n        }});"

content = re.sub(r"timers\.push\(setTimeout\(\(\) => \{\n(.*?)\n\s*\}, (.*?)\)\);", replace_multiline_timer, content, flags=re.DOTALL)


# Replace the end logic
old_end = """      return () => timers.forEach(timer => clearTimeout(timer));
    });
  }"""

new_end = """      scheduledActions.sort((a, b) => a.time - b.time);
      const startTime = Date.now();
      let timeoutId: any;
      let isCompleted = false;

      const runSchedule = () => {
        if (isCompleted) return;
        
        if (backlogStore.fastForwardAnalysis()) {
          scheduledActions.forEach(s => s.action());
          scheduledActions.length = 0;
          isCompleted = true;
          return;
        }

        const now = Date.now();
        const elapsed = now - startTime;

        while (scheduledActions.length > 0 && elapsed >= scheduledActions[0].time) {
          scheduledActions[0].action();
          scheduledActions.shift();
        }

        if (scheduledActions.length > 0) {
          timeoutId = setTimeout(runSchedule, 50);
        } else {
          isCompleted = true;
        }
      };

      runSchedule();

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        isCompleted = true;
      };
    });
  }"""

content = content.replace("      return () => timers.forEach(timer => clearTimeout(timer));\n    });\n  }", new_end, 1)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated ai.service.ts")
