import { Button, Cell, CellGroup, Form, Field, Col, Row, Icon, RadioGroup, Radio, Checkbox, CheckboxGroup, Uploader, ImagePreview, Picker, Popup, Toast, DatetimePicker, DropdownMenu, DropdownItem, Overlay, Loading } from 'vant'
import type { App } from 'vue'

/**
 * vant 配置
 * @param app
 */
export function setupVant (app: App<Element>): void {
  app
    .use(Button)
    .use(Cell)
    .use(CellGroup)
    .use(Form)
    .use(Field)
    .use(Col)
    .use(Row)
    .use(Icon)
    .use(RadioGroup)
    .use(Radio)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(Uploader)
    .use(ImagePreview)
    .use(Picker)
    .use(Popup)
    .use(Toast)
    .use(DatetimePicker)
    .use(DropdownMenu)
    .use(DropdownItem)
    .use(Overlay)
    .use(Loading)
}
