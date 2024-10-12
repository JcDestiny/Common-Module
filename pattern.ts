// 由4-32个字符(字母/字母+数字)组成 <-----> (用户名)
export const usernamePattern = /^(?![0-9]+$)[0-9A-Za-z]{4,32}$/;
export const usernameHint = "由4-32个字符(字母/字母+数字)组成";

// 由字母（区分大小写）+ 数字组成，可输入符号，长度6-32个字符 <-----> (用户密码)
export const passwordPattern =
  /^(?=.*[0-9]+)(?=.*[a-zA-Z]+)([0-9A-Za-z!"#%&'${}()*+,-.:;<=>?@^_`~|]|\/|\\|\[|\]){6,32}$/;
export const passwordHint =
  "由6-32个字符（字母+数字）组成，区分大小写，可输入符号";

// (邮箱)
export const emailPattern =
  /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
export const emailHint = "请输入正确格式的电子邮箱";

// (电话)
export const phonePattern = /^\d{7,}$/;
export const phoneHint = "请输入正确的手机号码";

// (验证码)
export const codePattern = /^\d{4,6}$/;
export const codeHint = "请输入正确的验证码";

// (验证码)
export const jobNumberPattern = /^\d{3,}$/;
export const jobNumberHint = "工号长度大于等于3位";

// ------------------------------------------------------------END------------------------------------------------------------------------
// 子账户/矿机密码 先校验特殊字符，在校验长度
export function globalPatten(txt: string, patternType: string = "username") {
  const pattenTxt = txt.trim();
  const kt = {
    username: usernamePattern,
    password: passwordPattern,
    email: emailPattern,
    phone: phonePattern,
    code: codePattern,
    jobnumber: jobNumberPattern,
  };
  const errors = {
    username: usernameHint,
    password: passwordHint,
    email: emailHint,
    phone: phoneHint,
    code: codeHint,
    jobnumber: jobNumberHint,
  };
  const success = kt[patternType as keyof typeof kt].test(pattenTxt);
  let error = "";
  if (!success) {
    error = errors[patternType as keyof typeof errors];
  }
  return {
    success,
    error,
    text: pattenTxt,
  };
}
