package example

import "core:fmt"
import rl "vendor:raylib"

Vec2 :: rl.Vector2
Rect :: rl.Rectangle
Color :: rl.Color

State :: struct {
    should_exit: bool,
    mouse_claimed: bool,
    screen: HomeScreen,
}

HomeScreen :: struct {
    title_txt: Text,
    play_btn: Button,
    exit_btn: Button,
}

Text :: struct {
    rect: Rect,
    // only using cstring instead of string here because Raylib needs it
    text: cstring,
    font_size: i32,
    color: Color,
}

Button :: struct {
    rect: Rect,
    text: cstring,
    moused: bool,
    mouse_down: bool,
    mouse_held: bool,
    mouse_up: bool,
}

s: ^State

main :: proc() {
    s = new(State)
    defer free(s)

    rl.SetConfigFlags({.WINDOW_RESIZABLE})
    rl.InitWindow(800, 800, "Example")
    rl.SetTargetFPS(60)

    for !s.should_exit && !rl.WindowShouldClose() {
        update()
        draw()
    }

    rl.CloseWindow()
}

update :: proc() {
    s.mouse_claimed = false
    window_size := Vec2 {
        f32(rl.GetScreenWidth()),
        f32(rl.GetScreenHeight()),
    }

    s.screen.title_txt = Text {
        rect = Rect {
            0,
            0,
            window_size.x,
            120,
        },
        text = "Example",
        font_size = 52,
        color = rl.WHITE,
    }

    btn_width := f32(128)
    btn_height := f32(64)
    btn_padding := f32(32)
    x := window_size.x/2-btn_width/2
    y := window_size.y/2

    s.screen.play_btn = Button {
        rect = Rect {
            x,
            y,
            btn_width,
            btn_height,
        },
        text = "Play"
    }
    y += btn_height+btn_padding
    s.screen.exit_btn = Button {
        rect = Rect {
            x,
            y,
            btn_width,
            btn_height,
        },
        text = "Exit"
    }

    poll_btn(&s.screen.play_btn)
    if s.screen.play_btn.mouse_up {
        fmt.println("clicked the play button")
    }
    poll_btn(&s.screen.exit_btn)
    if s.screen.exit_btn.mouse_up {
        fmt.println("clicked the exit button")
        s.should_exit = true
    }
}

poll_btn :: proc(b: ^Button) {
    mouse_pos := rl.GetMousePosition()
    if !s.mouse_claimed && rl.CheckCollisionPointRec(mouse_pos, b.rect) {
        s.mouse_claimed = true
        b.moused = true

        if rl.IsMouseButtonPressed(.LEFT) {
            b.mouse_down = true
        } else if rl.IsMouseButtonDown(.LEFT) {
            b.mouse_held = true
        } else if rl.IsMouseButtonReleased(.LEFT) {
            b.mouse_up = true
        }
    }
}

draw :: proc() {
    rl.BeginDrawing()
    rl.ClearBackground(rl.BLACK)
    draw_txt(s.screen.title_txt)
    draw_btn(s.screen.play_btn)
    draw_btn(s.screen.exit_btn)
    rl.EndDrawing()
}

draw_txt :: proc(t: Text) {
    width := rl.MeasureText(t.text, t.font_size)
    draw_x := t.rect.x+t.rect.width/2-f32(width/2)
    draw_y := t.rect.y+t.rect.height/2-f32(t.font_size/2)
    rl.DrawText(t.text, i32(draw_x), i32(draw_y), t.font_size, t.color)
}

draw_btn :: proc(b: Button) {
    color := rl.BLACK
    bg_color := rl.WHITE
    if b.mouse_held {
        bg_color = rl.SKYBLUE
    } else if b.moused {
        bg_color = rl.LIGHTGRAY
    }
    rl.DrawRectangleRec(b.rect, bg_color)
    draw_txt(Text {
        rect = b.rect,
        text = b.text,
        font_size = 48,
        color = color,
    })
}
