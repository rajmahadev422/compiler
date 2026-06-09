#include <bits/stdc++.h>
using namespace std;

#define ll long long

void solve() {
    ll n;
    cin>>n;

    unordered_map<ll, ll> m;

    for(ll i = 0;i < n;i++) {
        ll k;
        cin>>k;
        m[k]++;
    }

    int ans = 0, cnt = 0, ext = 0, flag = true;

    for(auto ele:m) {
        if(ele.second <= 1) {
            cnt += ele.second;
            continue;
        }
        if(flag and ele.second % 2) ext++; 
        ans += ele.second - ele.second % 2;
        cnt += ele.second % 2;
        ext += ele.second / 2;
    }

    ans += min(ext, cnt);

    cout<<ans<<endl;
}
int main() {
    int t;
    cin>>t;

    while(t--) solve();
    return 0;
}